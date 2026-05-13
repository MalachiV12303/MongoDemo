from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models.user import UserCreate, UserLogin
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserCreate):
    existing = users_collection.find_one(
        {"email": user.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": "user"
    })

    return {"message": "User created"}

@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"]
    })

    return {"access_token": token}