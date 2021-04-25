from contextlib import contextmanager
from typing import Generator

from app.db.database import SessionLocal


@contextmanager
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
