from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)

db = client["sample_mflix"]
sample_movies = db["movies"]
user_movies = db["user_movies"]