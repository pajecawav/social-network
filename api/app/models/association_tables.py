from sqlalchemy import Column, ForeignKey, Integer, Table

from app.db.database import Base

friends_association_table = Table(
    "friends_association",
    Base.metadata,
    Column("first_user_id", Integer, ForeignKey("users.user_id")),
    Column("second_user_id", Integer, ForeignKey("users.user_id")),
)

chat_user_association_table = Table(
    "chat_user_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.user_id")),
    Column("chat_id", Integer, ForeignKey("chats.chat_id")),
)
