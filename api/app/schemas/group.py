from typing import List, Optional

from pydantic import BaseModel, Field, PositiveInt

from .file import Image
from .user import User


class Group(BaseModel):
    group_id: int
    name: str
    short_description: Optional[str]
    description: Optional[str]

    admin: User
    avatar: Optional[Image]

    is_following: Optional[bool]
    is_admin: Optional[bool]

    class Config:
        orm_mode = True


class GroupCreate(BaseModel):
    name: str
    short_description: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)


class GroupUpdate(BaseModel):
    name: Optional[str]
    short_description: Optional[str]
    description: Optional[str]


class GroupsPaginationOut(BaseModel):
    total_matches: int
    groups: List[Group]
    next_cursor: Optional[PositiveInt] = None


class GroupUsersPagination(BaseModel):
    users: List[User]
    total_matches: int
