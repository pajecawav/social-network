from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.main import app


@pytest.fixture(scope="session")
def db() -> Generator[Session, None, None]:
    try:
        session = SessionLocal()
        yield session
    finally:
        session.close()


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c
