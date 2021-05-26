from socketio import AsyncServer

from .chat import chat
from .online import online


def register_namespaces(server: AsyncServer) -> None:
    server.register_namespace(chat)
    server.register_namespace(online)
