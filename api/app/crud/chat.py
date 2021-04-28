from typing import Any, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Chat


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


chat = CRUDChat()
