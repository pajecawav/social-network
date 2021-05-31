from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import backref, relationship

from app.db.database import Base

from .association_tables import (
    chat_user_association_table,
    friend_requests_association_table,
    friends_association_table,
)

if TYPE_CHECKING:
    from .chat import Chat  # noqa
    from .file import Image  # noqa
    from .message import Message  # noqa
    from .user_info import UserInfo  # noqa

USER_IS_OFFLINE_TIMEOUT_SECONDS = 5 * 60  # 5 minutes


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hashed = Column(String, nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    avatar_id = Column(UUID, ForeignKey("images.file_id"), nullable=True)
    avatar = relationship("Image", cascade="all,delete")

    last_seen = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    user_info_id = Column(Integer, ForeignKey("user_info.user_info_id"))
    user_info = relationship("UserInfo", backref=backref("user", uselist=False))

    friends = relationship(
        "User",
        secondary=friends_association_table,
        lazy="dynamic",
        primaryjoin=user_id == friends_association_table.c.first_user_id,
        secondaryjoin=user_id == friends_association_table.c.second_user_id,
    )
    sent_friend_requests = relationship(
        "User",
        secondary=friend_requests_association_table,
        lazy="dynamic",
        primaryjoin=user_id == friend_requests_association_table.c.from_user_id,
        secondaryjoin=user_id == friend_requests_association_table.c.to_user_id,
    )
    incoming_friend_requests = relationship(
        "User",
        secondary=friend_requests_association_table,
        lazy="dynamic",
        primaryjoin=user_id == friend_requests_association_table.c.to_user_id,
        secondaryjoin=user_id == friend_requests_association_table.c.from_user_id,
    )

    messages = relationship("Message", back_populates="user", lazy="dynamic")

    chats = relationship(
        "Chat",
        secondary=chat_user_association_table,
        back_populates="users",
        lazy="dynamic",
    )

    @property
    def is_online(self) -> bool:
        now = datetime.now(timezone.utc)
        diff = now - self.last_seen
        return diff.total_seconds() < USER_IS_OFFLINE_TIMEOUT_SECONDS
