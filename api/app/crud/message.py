from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Message
from app.schemas import MessageCreate, MessageUpdate


class CRUDMessage(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def create(  # type: ignore
        self, db: Session, message_in: MessageCreate, *, user_id: int, chat_id: int
    ) -> Message:
        message = Message(
            **jsonable_encoder(message_in), user_id=user_id, chat_id=chat_id
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message


message = CRUDMessage(Message)