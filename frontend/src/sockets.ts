import io from "socket.io-client";
import { getLocalToken } from "./utils";

const SOCKETIO_SERVER_PATH = "/api/ws/socket.io";

export const getSocket = (namespace = "/") =>
    io(namespace, {
        path: SOCKETIO_SERVER_PATH,
        auth: {
            token: getLocalToken(),
        },
    });
