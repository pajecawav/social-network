from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DateTime

from app.db.database import Base

if TYPE_CHECKING:
    from .chat import Chat  # noqa
    from .chat_action import ChatAction  # noqa
    from .user import User  # noqa


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True)
    text = Column(String, nullable=True)

    time_sent = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    time_edited = Column(
        DateTime(timezone=True), onupdate=datetime.utcnow, nullable=True
    )

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    user = relationship("User", back_populates="messages")

    chat_id = Column(Integer, ForeignKey("chats.chat_id"), nullable=False)
    chat = relationship("Chat", back_populates="messages", foreign_keys=[chat_id])

    action_id = Column(
        Integer, ForeignKey("chat_actions.chat_action_id"), nullable=True
    )
    action = relationship("ChatAction", back_populates="message", cascade="all, delete")
