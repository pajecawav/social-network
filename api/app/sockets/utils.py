from contextlib import contextmanager
from typing import Generator

from sqlalchemy.orm import Session

from app.db.database import SessionLocal


@contextmanager
def get_db() -> Generator[Session, None, None]:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
