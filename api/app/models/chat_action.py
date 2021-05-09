from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.chat_action import ChatActionTypeEnum


class ChatAction(Base):
    __tablename__ = "chat_actions"

    chat_action_id = Column(Integer, primary_key=True)
    chat_action_type = Column(
        ENUM(
            ChatActionTypeEnum,
            values_callable=lambda x: [e.value for e in x],
            name="chat_action_type_enum",
        ),
        nullable=True,
    )

    message = relationship("Message", back_populates="action", uselist=False)
