from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, HttpUrl, validator

MIN_BIRTHDATE = date(year=1900, month=1, day=1)
MAX_BIRTHDATE = date(year=2020, month=1, day=1)


class GenderEnum(str, Enum):
    male: str = "male"
    female: str = "female"


class UserInfo(BaseModel):
    gender: Optional[GenderEnum]
    birthdate: Optional[date]
    relationship_status: Optional[str]
    country: Optional[str]
    city: Optional[str]
    website: Optional[HttpUrl]
    email: Optional[EmailStr]

    class Config:
        orm_mode = True


class UserInfoUpdate(BaseModel):
    gender: Optional[GenderEnum]
    birthdate: Optional[date]
    relationship_status: Optional[str] = Field(None, min_length=1)
    country: Optional[str] = Field(None, min_length=1)
    city: Optional[str] = Field(None, min_length=1)
    website: Optional[HttpUrl]
    email: Optional[EmailStr]

    @validator("birthdate")
    def ensure_birthdate_in_range(cls, value: Optional[date]) -> Optional[date]:
        if value is None:
            return value

        if not MIN_BIRTHDATE <= value < MAX_BIRTHDATE:
            raise ValueError("Birthdate must be in range")

        return value
