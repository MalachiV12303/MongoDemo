from jose import jwt
from datetime import datetime, timedelta
from app.config import ALGORITHM, SECRET_KEY

def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=2)

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token