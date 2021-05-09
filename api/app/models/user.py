from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.user import GenderEnum

from .association_tables import chat_user_association_table, friends_association_table

USER_IS_OFFLINE_TIMEOUT_SECONDS = 5 * 60  # 5 minutes


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hashed = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    last_seen = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    gender = Column(
        ENUM(
            GenderEnum,
            values_callable=lambda x: [e.value for e in x],
            name="gender_enum",
        ),
        nullable=True,
    )
    birthdate = Column(Date, nullable=True)
    status = Column(String, nullable=True)

    friends = relationship(
        "User",
        secondary=friends_association_table,
        lazy="dynamic",
        primaryjoin=user_id == friends_association_table.c.first_user_id,
        secondaryjoin=user_id == friends_association_table.c.second_user_id,
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
