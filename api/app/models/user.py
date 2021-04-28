from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.user import GenderEnum

from .association_tables import chat_user_association_table, friends_association_table


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hashed = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
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
        order_by="User.user_id",
    )

    messages = relationship("Message", back_populates="user", lazy="dynamic")

    chats = relationship(
        "Chat",
        secondary=chat_user_association_table,
        back_populates="users",
        lazy="dynamic",
        order_by="Chat.chat_id",
    )
