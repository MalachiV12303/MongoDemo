import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_movies_invalid_lower_year():
    response = client.get("/movies", params={"lowerYear": 1800})
    assert response.status_code == 400
    assert response.json()["detail"] == "Lower year cannot be earlier than 1888"

def test_get_movies_invalid_upper_year():
    response = client.get("/movies", params={"upperYear": 1800})
    assert response.status_code == 400
    assert response.json()["detail"] == "Upper year cannot be earlier than 1888"

def test_get_movies_upper_less_than_lower():
    response = client.get("/movies", params={"lowerYear": 2000, "upperYear": 1990})
    assert response.status_code == 400
    assert response.json()["detail"] == "Upper year cannot be less than lower year"

def test_get_movies_valid_year_range():
    response = client.get("/movies", params={"lowerYear": 1990, "upperYear": 2000})
    assert response.status_code == 200

def test_get_movies_genre_filter():
    response = client.get("/movies", params={"genre": "Action"})
    assert response.status_code == 200