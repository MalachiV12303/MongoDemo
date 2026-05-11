from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
collection = db["movies"]

@app.get("/")
def home():
    return {"message": "backend works"}

@app.get("/movies")
def get_movies():
    movies = list(
        collection.find(
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

# @app.get("/test-db")
# def test_db():
#     collection.insert_one({"name": "test user"})
#     return {"message": "Inserted into MongoDB"}