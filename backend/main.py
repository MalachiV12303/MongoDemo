from bson import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv() #env file
app = FastAPI() #api routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#mongo uri connection
mongo_uri = os.getenv("MONGO_URI") 
client = MongoClient(mongo_uri)

db = client["sample_mflix"]
sample_movies = db["movies"]
user_movies = db["user_movies"]

class MovieUpdate(BaseModel):
    year: int

class Movie(BaseModel):
    title: str
    year: int
    genres: list[str]

#CREATE
@app.post("/movies")
def create_movie(movie: Movie):
    user_movies.insert_one(movie.dict())
    return {"message": "Movie created"}

#READ
@app.get("/movies")
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

@app.get("/all-movies")
def get_all_movies(
    title: str = None,
    year: int = None,
    genre: str = None,
    resultLimit: int = 20,
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
            {"title": 1, "year": 1, "genres": 1}
        ).limit(resultLimit)
    )
    user_data = list(
        user_movies.find(
            query,
            {"title": 1, "year": 1, "genres": 1}
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

#UPDATE - patch updates one field, put replaces all
@app.patch("/movies/{movie_id}")
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

#DELETE
@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: str):
    result = user_movies.delete_one(
        {"_id": ObjectId(movie_id)}
    )

    if result.deleted_count == 0:
        return {"message": "Movie not found"}

    return {"message": "Movie deleted successfully"}
# @app.get("/test-db")
# def test_db():
#     collection.insert_one({"name": "test user"})
#     return {"message": "Inserted into MongoDB"}