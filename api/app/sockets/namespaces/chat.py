from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from socketio import AsyncNamespace

from app import crud, schemas
from app.sockets.utils import get_db, get_user


class ChatNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        if "token" not in auth:
            return False
        user = get_user(auth["token"])
        await self.save_session(sid, {"user_id": user.user_id})

    async def on_message(self, sid, data):
        if "chat_id" not in data or "message" not in data:
            return False

        try:
            message_in = schemas.MessageCreate(**data["message"])
        except ValidationError:
            return False

        session = await self.get_session(sid)

        with get_db() as db:
            chat = crud.chat.get(db, data["chat_id"])
            if chat is None:
                return False

            message = crud.message.create(
                db, message_in, user_id=session["user_id"], chat_id=chat.chat_id
            )
            crud.chat.set_last_message(db, chat, message)
            response = jsonable_encoder(schemas.Message.from_orm(message))

        await self.emit("message", response)
