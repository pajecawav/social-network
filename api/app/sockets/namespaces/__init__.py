from socketio import AsyncServer

from .chat import ChatNamespace


def register_namespaces(server: AsyncServer) -> None:
    server.register_namespace(ChatNamespace("/chat"))
