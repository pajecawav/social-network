from sqlalchemy import Column, ForeignKey, Integer, String, Unicode
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas import MessageTypeEnum


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True)
    message_type = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    user = relationship("User", back_populates="messages")

    chat_id = Column(Integer, ForeignKey("chats.chat_id"), nullable=False)
    chat = relationship("Chat", back_populates="messages")

    __mapper_args__ = {
        "polymorphic_identity": "messages",
        "with_polymorphic": "*",
        "polymorphic_on": message_type,
    }


class TextMessage(Message):
    __tablename__ = "text_messages"

    text_message_id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("messages.message_id"))

    text = Column(Unicode, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": MessageTypeEnum.text_message,
        "with_polymorphic": "*",
    }
