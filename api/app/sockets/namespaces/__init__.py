from socketio import AsyncServer

from .chat import ChatNamespace
from .online import OnlineNamespace


def register_namespaces(server: AsyncServer) -> None:
    server.register_namespace(ChatNamespace("/chat"))
    server.register_namespace(OnlineNamespace("/online"))
