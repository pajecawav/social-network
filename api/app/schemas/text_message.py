from pydantic import BaseModel, Field, PositiveInt

from .message import Message


class TextMessageCreate(BaseModel):
    text: str = Field(..., min_length=1)


class TextMessage(Message):
    text_message_id: PositiveInt
    text: str

    class Config:
        orm_mode = True


class TextMessageUpdate(BaseModel):
    text: str = Field(..., min_length=1)
