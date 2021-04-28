from datetime import datetime

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DateTime

from app.db.database import Base


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True)
    text = Column(String, nullable=True)

    time_sent = Column(
        DateTime(timezone=True), default=datetime.utcnow(), nullable=False
    )

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    user = relationship("User", back_populates="messages")

    chat_id = Column(Integer, ForeignKey("chats.chat_id"), nullable=False)
    chat = relationship("Chat", back_populates="messages")
