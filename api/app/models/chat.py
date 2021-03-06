from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.chat import ChatTypeEnum

from .association_tables import chat_user_association_table

if TYPE_CHECKING:
    from .file import Image  # noqa
    from .message import Message  # noqa
    from .user import User  # noqa


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True)
    chat_type = Column(String, nullable=False)

    messages = relationship(
        "Message",
        back_populates="chat",
        lazy="dynamic",
        cascade="all, delete, delete-orphan",
        foreign_keys="Message.chat_id",
    )
    last_message_id = Column(Integer, ForeignKey("messages.message_id"))
    last_message = relationship(
        "Message", uselist=False, foreign_keys=[last_message_id], post_update=True
    )

    users = relationship(
        "User",
        secondary=chat_user_association_table,
        back_populates="chats",
        lazy="dynamic",
    )

    __mapper_args__ = {
        "polymorphic_identity": "chats",
        "with_polymorphic": "*",
        "polymorphic_on": chat_type,
    }


class DirectChat(Chat):
    __tablename__ = "direct_chats"

    chat_id = Column(Integer, ForeignKey("chats.chat_id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": ChatTypeEnum.direct,
        "with_polymorphic": "*",
    }


class GroupChat(Chat):
    __tablename__ = "group_chats"

    chat_id = Column(Integer, ForeignKey("chats.chat_id"), primary_key=True)

    title = Column(String, nullable=False)
    invite_code = Column(String, nullable=True)

    admin_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    admin = relationship("User", foreign_keys=[admin_id])

    avatar_id = Column(UUID, ForeignKey("images.file_id"), nullable=True)
    avatar = relationship("Image", cascade="all,delete")

    __mapper_args__ = {
        "polymorphic_identity": ChatTypeEnum.group,
        "with_polymorphic": "*",
    }
