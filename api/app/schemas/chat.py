from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from .file import Image
from .message import Message
from .user import User


class ChatTypeEnum(str, Enum):
    direct = "direct"
    group = "group"


class Chat(BaseModel):
    chat_id: int
    chat_type: ChatTypeEnum
    last_message: Optional[Message]
    last_seen_message_id: Optional[int]

    class Config:
        orm_mode = True


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
    avatar: Optional[Image]


class GroupChatUpdate(BaseModel):
    title: str = Field(..., min_length=1)


class GroupChatInviteCode(BaseModel):
    invite_code: Optional[str]


class JoinGroupChatOut(BaseModel):
    chat_id: int
