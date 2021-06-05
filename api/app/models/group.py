from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base

from .association_tables import group_user_association_table

if TYPE_CHECKING:
    from .file import Image  # noqa: F401
    from .message import Message  # noqa: F401
    from .user import User  # noqa: F401


class Group(Base):
    __tablename__ = "groups"

    group_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    short_description = Column(String, nullable=True)
    description = Column(String, nullable=True)

    admin_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    admin = relationship("User", foreign_keys=[admin_id])

    avatar_id = Column(UUID, ForeignKey("images.file_id"), nullable=True)
    avatar = relationship("Image", cascade="all,delete")

    users = relationship(
        "User",
        secondary=group_user_association_table,
        back_populates="groups",
        lazy="dynamic",
    )
