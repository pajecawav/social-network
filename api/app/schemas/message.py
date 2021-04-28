from datetime import datetime
from typing import Optional

from pydantic import BaseModel, PositiveInt
from pydantic.fields import Field

from .user import User


class MessageCreate(BaseModel):
    text: Optional[str] = Field(..., min_length=1)


class Message(BaseModel):
    message_id: PositiveInt
    text: Optional[str]
    time_sent: datetime

    user: User

    class Config:
        orm_mode = True


class MessageUpdate(BaseModel):
    text: Optional[str] = Field(..., min_length=1)
