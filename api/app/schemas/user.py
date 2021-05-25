from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, PositiveInt

from .file import Image


class FriendStatusEnum(str, Enum):
    friend = "friend"
    not_friend = "not_friend"
    request_sent = "request_sent"
    request_received = "request_received"


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
    avatar: Optional[Image]

    is_online: bool
    last_seen: datetime

    friend_status: Optional[FriendStatusEnum]

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
