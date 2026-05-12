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

# READ / FILTER
@router.get("/movies")
def get_movies(
    title: str = None,
    lowerYear: int = None,
    upperYear: int = None,
    genre: str = None,
    userResultLimit: int = 20,
    sampleResultLimit: int = 20
):
    query = {}
    genres = [g.strip() for g in genre.split(",")] if genre else None
    print("genres:", genres)
    if title:
        query["title"] = {
            "$regex": title,
            "$options": "i"
        }

    if lowerYear or upperYear:
        query["year"] = {}
        if lowerYear:
            query["year"]["$gte"] = lowerYear
        if upperYear:
            query["year"]["$lte"] = upperYear

    if genres:
        print("adding genres to query:", genres)
        query["genres"] = {
            "$in": genres
        }
    
    sample_data = list(
        sample_movies.find(
            query,
            {
                "title": 1,
                "year": 1,
                "genres": 1
            }
        ).limit(sampleResultLimit)
    )

    user_data = list(
        user_movies.find(
            query,
            {
                "title": 1,
                "year": 1,
                "genres": 1
            }
        ).limit(userResultLimit)
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
    update_data = {}

    if movie.title is not None:
        update_data["title"] = movie.title

    if movie.year is not None:
        update_data["year"] = movie.year

    if not update_data:
        return {"message": "No fields provided to update"}

    result = user_movies.update_one(
        {"_id": ObjectId(movie_id)},
        {
            "$set": update_data
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