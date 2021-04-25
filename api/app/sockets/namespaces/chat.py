from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from socketio import AsyncNamespace

from app import crud, schemas
from app.security import TokenDecodingError, decode_token
from app.sockets.utils import get_db


class ChatNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        if "token" not in auth:
            return False

        try:
            payload = decode_token(auth["token"])
            token_data = schemas.TokenPayload(**payload)
        except (TokenDecodingError, ValidationError):
            return False

        with get_db() as db:
            user = crud.user.get(db, id=token_data.sub)

        if user is None:
            return False

        assert sid is not None
        await self.save_session(sid, {"user_id": user.user_id})

    async def on_message(self, sid, data):
        if "chat_id" not in data or "message" not in data:
            return False

        try:
            message_in = schemas.TextMessageCreate(**data["message"])
        except ValidationError:
            return False

        assert sid is not None
        session = await self.get_session(sid)

        with get_db() as db:
            text_message = crud.text_message.create(
                db, message_in, user_id=session["user_id"], chat_id=data["chat_id"]
            )
            response = jsonable_encoder(schemas.TextMessage.from_orm(text_message))

        await self.emit("message", response)
