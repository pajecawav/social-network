from fastapi import FastAPI

from app.api import api
from app.sockets.asgi import socketio_asgi_app

app = FastAPI(title="Social Network")


app.include_router(api.api_router)

app.mount("/ws", socketio_asgi_app)
