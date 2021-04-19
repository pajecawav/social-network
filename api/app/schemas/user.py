from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, PositiveInt, Field


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
    status: Optional[str]

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    gender: Optional[GenderEnum]
    status: Optional[str]


class UsersPaginationOut(BaseModel):
    total_matches: int = Field(ge=0)
    users: List[User]
    next_cursor: Optional[PositiveInt] = None
