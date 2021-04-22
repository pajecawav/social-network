from datetime import date
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, PositiveInt, validator

MIN_BIRTHDATE = date(year=1900, month=1, day=1)
MAX_BIRTHDATE = date(year=2020, month=1, day=1)


class GenderEnum(str, Enum):
    male: str = "male"
    female: str = "female"


class UserCreate(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str


class User(BaseModel):
    user_id: PositiveInt
    username: str
    first_name: str
    last_name: str
    gender: Optional[GenderEnum]
    birthdate: Optional[date]
    status: Optional[str]

    is_friend: Optional[bool]

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    gender: Optional[GenderEnum]
    birthdate: Optional[date]
    status: Optional[str]

    @validator("birthdate")
    def ensure_birthdate_in_range(cls, value: Optional[date]) -> Optional[date]:
        if value is None:
            return value

        if not MIN_BIRTHDATE <= value < MAX_BIRTHDATE:
            raise ValueError("Birthdate must be in range")

        return value


class UsersPaginationOut(BaseModel):
    total_matches: int = Field(ge=0)
    users: List[User]
    next_cursor: Optional[PositiveInt] = None
