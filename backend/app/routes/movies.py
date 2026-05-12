from fastapi import APIRouter
from bson import ObjectId
from app.database import sample_movies, user_movies
from app.models.movie import Movie, MovieUpdate

router = APIRouter()

# CREATE
@router.post("/movies")
def create_movie(movie: Movie):
    user_movies.insert_one(movie.dict())
    return {"message": "Movie created"}

# READ
@router.get("/movies")
def get_movies():
    movies = list(
        sample_movies.find(
            {},
            {
                "_id": 0,
                "title": 1,
                "year": 1,
                "genres": 1
            }
        ).limit(20)
    )

    return movies

# ADVANCED READ / FILTER
@router.get("/all-movies")
def get_all_movies(
    title: str = None,
    year: int = None,
    genre: str = None,
    resultLimit: int = 20
):
    query = {}

    if title:
        query["title"] = {
            "$regex": title,
            "$options": "i"
        }

    if year:
        query["year"] = {
            "$gte": year
        }

    if genre:
        query["genres"] = {
            "$regex": genre,
            "$options": "i"
        }

    sample_data = list(
        sample_movies.find(
            query,
            {
                "title": 1,
                "year": 1,
                "genres": 1
            }
        ).limit(resultLimit)
    )

    user_data = list(
        user_movies.find(
            query,
            {
                "title": 1,
                "year": 1,
                "genres": 1
            }
        )
    )

    for movie in sample_data:
        movie["_id"] = str(movie["_id"])
        movie["source"] = "sample"

    for movie in user_data:
        movie["_id"] = str(movie["_id"])
        movie["source"] = "user"

    combined = user_data + sample_data

    return combined


# UPDATE
@router.patch("/movies/{movie_id}")
def update_movie(movie_id: str, movie: MovieUpdate):
    result = user_movies.update_one(
        {"_id": ObjectId(movie_id)},
        {
            "$set": {
                "year": movie.year
            }
        }
    )

    if result.matched_count == 0:
        return {"message": "Movie not found"}

    return {"message": "Movie updated successfully"}


# DELETE
@router.delete("/movies/{movie_id}")
def delete_movie(movie_id: str):
    result = user_movies.delete_one(
        {
            "_id": ObjectId(movie_id)
        }
    )

    if result.deleted_count == 0:
        return {"message": "Movie not found"}

    return {"message": "Movie deleted successfully"}