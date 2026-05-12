from pydantic import BaseModel
from typing import Optional

class Movie(BaseModel):
    title: str
    year: int
    genres: list[str]

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    year: Optional[int] = None