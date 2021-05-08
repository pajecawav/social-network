from socketio import AsyncNamespace

from app import crud
from app.sockets.utils import get_db, get_user


class OnlineNamespace(AsyncNamespace):
    async def on_connect(self, sid, environ, auth):
        if "token" not in auth:
            return False
        user = get_user(auth["token"])
        await self.save_session(sid, {"user_id": user.user_id})

    async def on_online(self, sid):
        session = await self.get_session(sid)

        with get_db() as db:
            user = crud.user.get(db, session["user_id"])
            crud.user.update_last_seen(db, user)
