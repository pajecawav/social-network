from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, PositiveInt


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

    is_online: bool
    last_seen: datetime

    is_friend: Optional[bool]

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]


class UsersPaginationOut(BaseModel):
    total_matches: int = Field(ge=0)
    users: List[User]
    next_cursor: Optional[PositiveInt] = None


class FriendsPaginationOut(BaseModel):
    total_matches: int = Field(ge=0)
    friends: List[User]
    next_cursor: Optional[PositiveInt] = None
