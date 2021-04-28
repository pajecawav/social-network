from enum import Enum

from pydantic import BaseModel, Field

from .user import User


class ChatTypeEnum(str, Enum):
    direct = "direct"
    group = "group"


class Chat(BaseModel):
    chat_id: int
    chat_type: ChatTypeEnum


class DirectChatCreate(BaseModel):
    pass


class DirectChat(Chat):
    peer: User

    class Config:
        orm_mode = True


class DirectChatUpdate(BaseModel):
    pass


class GroupChatCreate(BaseModel):
    title: str = Field(..., min_length=1)


class GroupChat(Chat):
    title: str
    admin: User

    class Config:
        orm_mode = True


class GroupChatUpdate(BaseModel):
    title: str = Field(..., min_length=1)
