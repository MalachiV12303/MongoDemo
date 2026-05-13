from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import sample_movies, user_movies
from app.models.movie import Movie, MovieUpdate
from app.auth.dependencies import get_current_user

router = APIRouter()

def require_admin(user):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

def require_owner_or_admin(movie, user):
    if user.get("role") == "admin":
        return
    if movie.get("owner_email") != user.get("email"):
        raise HTTPException(
            status_code=403,
            detail="Not allowed to modify this movie"
        )
    
# CREATE
@router.post("/movies")
def create_movie(
    movie: Movie,
    user=Depends(get_current_user)
):
    movie_data = movie.dict()
    movie_data["owner_email"] = user["email"]
    user_movies.insert_one(movie_data)
    return {"message": "Movie created"}

# READ / FILTER
@router.get("/movies")
def get_movies(
    title: str = None,
    lowerYear: int = None,
    upperYear: int = None,
    genre: str = None,
    userResultLimit: int = 20,
    sampleResultLimit: int = 20,
    tableSelection: str = "all"
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
    
    print("tableSelection:", tableSelection)
    sample_data = []
    user_data = []
    if tableSelection == "sample" or tableSelection == "all":
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
    if tableSelection == "user" or tableSelection == "all":
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
@router.patch("/user-movies/{movie_id}")
def update_user_movie(
    movie_id: str,
    movie: MovieUpdate,
    user=Depends(get_current_user)
):
    try:
        object_id = ObjectId(movie_id)
    except:
        raise HTTPException(400, "Invalid movie ID")

    existing_movie = user_movies.find_one({"_id": object_id})

    if not existing_movie:
        raise HTTPException(404, "Movie not found")

    require_owner_or_admin(existing_movie, user)

    update_data = {
        k: v for k, v in {
            "title": movie.title,
            "year": movie.year,
        }.items()
        if v is not None
    }

    if not update_data:
        raise HTTPException(400, "No fields provided")

    user_movies.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    return {"message": "User movie updated"}

@router.patch("/sample-movies/{movie_id}")
def update_sample_movie(
    movie_id: str,
    movie: MovieUpdate,
    user=Depends(get_current_user)
):
    require_admin(user)

    try:
        object_id = ObjectId(movie_id)
    except:
        raise HTTPException(400, "Invalid movie ID")

    update_data = {
        k: v for k, v in {
            "title": movie.title,
            "year": movie.year,
            "genres": movie.genres
        }.items()
        if v is not None
    }

    if not update_data:
        raise HTTPException(400, "No fields provided")

    sample_movies.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    return {"message": "Sample movie updated"}

# DELETE
@router.delete("/user-movies/{movie_id}")
def delete_user_movie(
    movie_id: str,
    user=Depends(get_current_user)
):
    try:
        object_id = ObjectId(movie_id)
    except:
        raise HTTPException(400, "Invalid movie ID")

    movie = user_movies.find_one({"_id": object_id})

    if not movie:
        raise HTTPException(404, "Movie not found")

    require_owner_or_admin(movie, user)

    user_movies.delete_one({"_id": object_id})

    return {"message": "User movie deleted"}

@router.delete("/sample-movies/{movie_id}")
def delete_sample_movie(
    movie_id: str,
    user=Depends(get_current_user)
):
    require_admin(user)

    try:
        object_id = ObjectId(movie_id)
    except:
        raise HTTPException(400, "Invalid movie ID")

    sample_movies.delete_one({"_id": object_id})

    return {"message": "Sample movie deleted"}