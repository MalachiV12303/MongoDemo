from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from app.limiter import limiter
from app.routes.movies import router as movie_router
from app.routes.auth import router as auth_router

app = FastAPI()

# Set up rate limiter middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(
    status_code=429,
    content={"detail": "Too many requests. Please try again later."}
))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Movie API running"}