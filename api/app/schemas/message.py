from enum import Enum
from typing import Union

from pydantic import BaseModel, PositiveInt

from .user import User


class MessageTypeEnum(str, Enum):
    text_message = "text_message"


class Message(BaseModel):
    message_id: PositiveInt
    message_type: MessageTypeEnum

    user: User

    class Config:
        orm_mode = True


from .text_message import TextMessage, TextMessageCreate  # noqa: E402

AnyMessage = Union[TextMessage]
AnyMessageCreate = Union[TextMessageCreate]
