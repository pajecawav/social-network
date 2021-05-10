from socketio import AsyncServer

from . import chat, online


def register_namespaces(server: AsyncServer) -> None:
    server.register_namespace(chat.namespace)
    server.register_namespace(online.namespace)
