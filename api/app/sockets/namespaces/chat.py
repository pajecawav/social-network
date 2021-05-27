from typing import Dict, List

from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from socketio import AsyncNamespace

from app import crud, schemas
from app.security import TokenParsingError, parse_token
from app.sockets.utils import get_db


class ChatNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        if auth.get("token", None) is None:
            return False

        try:
            token_data = parse_token(auth["token"])
        except TokenParsingError:
            return False

        with get_db() as db:
            user = crud.user.get(db, token_data.sub)
            if user is None:
                return False
            chats = user.chats.all()

        await self.save_session(sid, {"user_id": user.user_id})

        self.enter_room(sid, f"user_{user.user_id}")
        for chat in chats:
            self.enter_room(sid, f"chat_{chat.chat_id}")

    async def on_new_message(self, sid, data, *args):
        if "chat_id" not in data or "message" not in data:
            return False

        try:
            chat_id = int(data["chat_id"])
        except ValueError:
            return False

        try:
            message_in = schemas.MessageCreate(**data["message"])
        except ValidationError:
            return False

        session = await self.get_session(sid)

        with get_db() as db:
            chat = crud.chat.get(db, chat_id)
            if chat is None:
                return False

            message = crud.message.create(
                db, message_in, user_id=session["user_id"], chat_id=chat.chat_id
            )
            crud.chat.set_last_message(db, chat, message)
            message_out = jsonable_encoder(schemas.Message.from_orm(message))

        await self.notify_new_message(chat_id, message_out)

    async def on_join_chat(self, sid, data):
        if "chat_id" not in data:
            return False

        chat_id = data["chat_id"]

        session = await self.get_session(sid)
        user_id = session["user_id"]

        with get_db() as db:
            if not crud.chat.is_user_in_chat(db, chat_id, user_id):
                return False

        self.enter_room(sid, f"chat_{chat_id}")

    async def on_update_last_seen_message(self, sid, data):
        if "chat_id" not in data or "message_id" not in data:
            return False

        session = await self.get_session(sid)
        chat_id = data["chat_id"]
        message_id = data["message_id"]
        user_id = session["user_id"]

        with get_db() as db:
            crud.chat.update_last_seen_message(db, chat_id, user_id, message_id)

    async def notify_new_message(self, chat_id: int, message: Dict[str, str]) -> None:
        await self.emit(
            "new_message",
            data={"chat_id": chat_id, "message": message},
            room=f"chat_{chat_id}",
        )

    async def notify_message_edited(
        self, chat_id: int, message: Dict[str, str]
    ) -> None:
        await self.emit(
            "message_edited",
            data={"chat_id": chat_id, "message": message},
            room=f"chat_{chat_id}",
        )

    async def notify_messages_deleted(
        self, chat_id: int, message_ids: List[int]
    ) -> None:
        await self.emit(
            "messages_deleted",
            data={"chat_id": chat_id, "message_ids": message_ids},
            room=f"chat_{chat_id}",
        )

    async def notify_user_new_chat(
        self, user_id: int, new_chat: Dict[str, str]
    ) -> None:
        await self.emit("new_chat", data=new_chat, room=f"user_{user_id}")


chat = ChatNamespace("/chat")
