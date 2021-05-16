from datetime import datetime
from typing import Optional

from pydantic import BaseModel, PositiveInt
from pydantic.fields import Field

from .chat_action import ChatAction
from .user import User


class MessageCreate(BaseModel):
    text: Optional[str] = Field(None, min_length=1)


class Message(BaseModel):
    message_id: PositiveInt
    text: Optional[str]
    time_sent: datetime
    time_edited: Optional[datetime]

    user: User
    action: Optional[ChatAction]

    class Config:
        orm_mode = True


class MessageUpdate(BaseModel):
    text: Optional[str] = Field(..., min_length=1)
