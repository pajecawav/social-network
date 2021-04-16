from sqlalchemy.orm import Session

from app.db.database import SessionLocal


def init_db(db: Session) -> None:
    # Base.metadata.create_all(bind=engine)

    pass


if __name__ == "__main__":
    init_db(SessionLocal())
