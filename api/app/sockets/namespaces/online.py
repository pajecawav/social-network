from socketio import AsyncNamespace

from app import crud
from app.security import TokenParsingError, parse_token
from app.sockets.utils import get_db


class OnlineNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        if "token" not in auth:
            return False
        try:
            token_data = parse_token(auth["token"])
        except TokenParsingError:
            return False

        with get_db() as db:
            user = crud.user.get(db, token_data.sub)
            if user is None:
                return False

        await self.save_session(sid, {"user_id": user.user_id})

    async def on_online(self, sid):
        session = await self.get_session(sid)

        with get_db() as db:
            user = crud.user.get(db, session["user_id"])
            if user is not None:
                crud.user.update_last_seen(db, user)


online = OnlineNamespace("/online")
