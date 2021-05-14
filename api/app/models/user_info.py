from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.dialects.postgresql import ENUM

from app.db.database import Base
from app.schemas import GenderEnum


class UserInfo(Base):
    __tablename__ = "user_info"

    user_info_id = Column(Integer, primary_key=True)

    status = Column(String, nullable=True)
    gender = Column(
        ENUM(
            GenderEnum,
            values_callable=lambda x: [e.value for e in x],
            name="gender_enum",
        ),
        nullable=True,
    )
    birthdate = Column(Date, nullable=True)
    relationship_status = Column(String, nullable=True)  # TODO: use an enum
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    website = Column(String, nullable=True)
    email = Column(String, nullable=True)
