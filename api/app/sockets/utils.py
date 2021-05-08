from contextlib import contextmanager
from typing import Generator, Optional

from pydantic import ValidationError

from app import crud, models, schemas
from app.db.database import SessionLocal
from app.security import TokenDecodingError, decode_token


@contextmanager
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_user(token: str) -> Optional[models.User]:
    try:
        payload = decode_token(token)
        token_data = schemas.TokenPayload(**payload)
    except (TokenDecodingError, ValidationError):
        return None

    with get_db() as db:
        user = crud.user.get(db, id=token_data.sub)

    return user
