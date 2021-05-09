from pydantic import BaseModel
from enum import Enum


class ChatActionTypeEnum(str, Enum):
    create = "create"


class ChatAction(BaseModel):
    chat_action_type: ChatActionTypeEnum

    class Config:
        orm_mode = True
