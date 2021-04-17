from enum import Enum
from typing import Optional

from pydantic import BaseModel


class GenderEnum(str, Enum):
    male: str = "male"
    female: str = "female"


class UserCreate(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str


class User(BaseModel):
    user_id: int
    username: str
    first_name: str
    last_name: str
    gender: Optional[GenderEnum]
    status: Optional[str]

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    gender: Optional[GenderEnum]
    status: Optional[str]
