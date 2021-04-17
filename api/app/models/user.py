from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import ENUM

from app.db.database import Base
from app.schemas.user import GenderEnum


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hashed = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    gender = Column(
        ENUM(
            GenderEnum,
            values_callable=lambda x: [e.value for e in x],
            name="gender_enum",
        ),
        nullable=True,
    )
    status = Column(String, nullable=True)
