import { decamelizeKeys } from "humps";
import io from "socket.io-client";
import { getLocalToken } from "./utils";

const SOCKETIO_SERVER_PATH = "/api/ws/socket.io";

export function getSocket(namespace = "/", query) {
    return io(namespace, {
        path: SOCKETIO_SERVER_PATH,
        auth: {
            token: getLocalToken(),
        },
        query: decamelizeKeys(query || {}),
    });
}
