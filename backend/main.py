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

class Movie(BaseModel):
    title: str
    year: int
    genres: list[str]

@app.post("/movies")
def create_movie(movie: Movie):
    user_movies.insert_one(movie.dict())
    return {"message": "Movie created"}

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
def get_all_movies():
    sample_data = list(
        sample_movies.find(
            {},
            {"_id": 0, "title": 1, "year": 1, "genres": 1}
        ).limit(10)
    )
    user_data = list(
        user_movies.find(
            {},
            {"_id": 0, "title": 1, "year": 1, "genres": 1}
        )
    )
    combined = sample_data + user_data
    return combined

# @app.get("/test-db")
# def test_db():
#     collection.insert_one({"name": "test user"})
#     return {"message": "Inserted into MongoDB"}