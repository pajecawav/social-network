from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import TextMessage
from app.schemas import TextMessageCreate, TextMessageUpdate


class CRUDTextMessage(CRUDBase[TextMessage, TextMessageCreate, TextMessageUpdate]):
    def create(  # type: ignore
        self, db: Session, message_in: TextMessageCreate, *, user_id: int, chat_id: int
    ) -> TextMessage:
        message = TextMessage(
            **jsonable_encoder(message_in), user_id=user_id, chat_id=chat_id
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message


text_message = CRUDTextMessage(TextMessage)
