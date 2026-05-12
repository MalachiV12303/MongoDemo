from pydantic import BaseModel

class Movie(BaseModel):
    title: str
    year: int
    genres: list[str]

class MovieUpdate(BaseModel):
    year: int