from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base

from .association_tables import chat_user_association_table


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)

    users = relationship(
        "User",
        secondary=chat_user_association_table,
        back_populates="chats",
        lazy="dynamic",
        order_by="User.user_id",
    )

    messages = relationship(
        "Message", back_populates="chat", lazy="dynamic", cascade="delete"
    )
