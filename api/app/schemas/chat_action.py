from enum import Enum
from typing import Optional

from pydantic import BaseModel

from .user import User


class ChatActionTypeEnum(str, Enum):
    create = "create"
    invite = "invite"
    leave = "leave"
    kick = "kick"
    join = "join"  # type: ignore


class ChatAction(BaseModel):
    chat_action_type: ChatActionTypeEnum
    towards_user: Optional[User]

    class Config:
        orm_mode = True
