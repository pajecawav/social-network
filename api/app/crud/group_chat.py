import random
import string

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import GroupChat, User
from app.schemas import GroupChatCreate, GroupChatUpdate


class CRUDGroupChat(CRUDBase[GroupChat, GroupChatCreate, GroupChatUpdate]):
    DISPLAY_NAME = "Group chat"

    def create(  # type: ignore
        self, db: Session, chat_in: GroupChatCreate, *, admin: User
    ) -> GroupChat:
        chat = GroupChat(**jsonable_encoder(chat_in), admin_id=admin.user_id)
        chat.users.append(admin)

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat

    def add_user(self, db: Session, chat: GroupChat, user: User) -> GroupChat:
        chat.users.append(user)

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat

    def remove_user(self, db: Session, chat: GroupChat, user: User) -> GroupChat:
        chat.users.remove(user)

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat

    @staticmethod
    def generate_invite_code() -> str:
        chars = string.ascii_letters + string.digits
        invite_code = "".join(random.choice(chars) for _ in range(24))
        return invite_code


group_chat = CRUDGroupChat(GroupChat)
