from typing import Optional

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import DirectChat, User
from app.schemas import DirectChatCreate, DirectChatUpdate


class CRUDDirectChat(CRUDBase[DirectChat, DirectChatCreate, DirectChatUpdate]):
    def create(  # type: ignore
        self, db: Session, *, first_user: User, second_user: User
    ) -> DirectChat:
        chat = DirectChat()
        chat.users.extend([first_user, second_user])

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat

    def get_by_user_ids(
        self, db: Session, *, first_user_id: int, second_user_id: int
    ) -> Optional[DirectChat]:
        chat = (
            db.query(DirectChat)
            .filter(
                and_(
                    DirectChat.users.any(user_id=first_user_id),
                    DirectChat.users.any(user_id=second_user_id),
                )
            )
            .first()
        )
        return chat

    def get_peer(self, db: Session, chat: DirectChat, user_id: int) -> User:
        for user in chat.users:
            if user.user_id != user_id:
                return user

        assert False


direct_chat = CRUDDirectChat(DirectChat)
