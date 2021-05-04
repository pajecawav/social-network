from typing import Any, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Chat
from app.models.message import Message


class CRUDChat:
    def get(self, db: Session, id: Any) -> Optional[Chat]:
        return db.query(Chat).get(id)

    def get_or_404(self, db: Session, id: Any) -> Chat:
        chat = db.query(Chat).get(id)

        if chat is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found.",
            )

        return chat

    def delete(self, db: Session, *, id: Any) -> None:
        chat = self.get(db, id)
        db.delete(chat)
        db.commit()

    def set_last_message(self, db: Session, chat: Chat, message: Message) -> Chat:
        chat.last_message = message

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat


chat = CRUDChat()
