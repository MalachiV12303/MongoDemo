from pydantic import BaseModel, field_validator
from typing import Optional, List

class Movie(BaseModel):
    title: str
    year: int
    genres: List[str]

    @field_validator("year")
    def validate_year(cls, value):
        if value < 1888:  # year the first movie was made
            raise ValueError("Year cannot be earlier than 1888")
        return value

    @field_validator("genres", mode="before") #using before to ensure proper validation of the input before further processing
    def validate_genres(cls, value):
        if not value or not all(isinstance(genre, str) for genre in value):
            raise ValueError("Each genre must be a non-empty string")
        return value

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    year: Optional[int] = None
    genres: Optional[List[str]] = None

    @field_validator("year")
    def validate_year(cls, value):
        if value and value < 1888:
            raise ValueError("Year cannot be earlier than 1888")
        return value

    @field_validator("genres", mode="before")
    def validate_genres(cls, value):
        if value and not all(isinstance(genre, str) for genre in value):
            raise ValueError("Each genre must be a non-empty string")
        return value