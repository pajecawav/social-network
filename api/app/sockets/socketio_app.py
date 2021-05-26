import socketio

from app.sockets.namespaces import register_namespaces

sio = socketio.AsyncServer(
    async_mode="asgi",
    logger=True,
    cors_allowed_origins=[],
)

register_namespaces(sio)

socketio_asgi_app = socketio.ASGIApp(
    sio,
    socketio_path="/socket.io",
)
