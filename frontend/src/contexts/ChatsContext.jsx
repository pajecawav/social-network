import { camelizeKeys, decamelizeKeys } from "humps";
import { createContext, useEffect, useRef } from "react";
import { getSocket } from "../sockets";

export const ChatsContext = createContext();

export function ChatsProvider({ children }) {
    const socket = useRef(null);
    const listeners = useRef({});
    const newChatListeners = useRef([]);

    useEffect(() => {
        const sio = getSocket("/chat");
        socket.current = sio;

        sio.on("message", (data) => {
            const { message, chatId } = camelizeKeys(data);
            listeners.current[chatId]?.forEach((listener) =>
                listener(message, chatId)
            );
            listeners.current["*"]?.forEach((listener) =>
                listener(message, chatId)
            );
        });

        sio.on("new_chat", (data) => {
            const chat = camelizeKeys(data);
            socket.current?.emit("join_chat", { chat_id: chat.chatId });
            newChatListeners.current.forEach((listener) => listener(chat));
        });

        return () => sio.disconnect();
    }, []);

    const subscribeToChat = (chatId, cb) => {
        const currentListeners = listeners.current[chatId];
        if (currentListeners) {
            currentListeners.push(cb);
        } else {
            listeners.current[chatId] = [cb];
        }
    };

    const unsubscribeFromChat = (chatId, cb) => {
        const currentListeners = listeners.current[chatId];
        if (!currentListeners) return;
        listeners.current[chatId] = currentListeners.filter(
            (listener) => listener !== cb
        );
    };

    const subscribeToNewChats = (cb) => {
        newChatListeners.current.push(cb);
    };

    const unsubscribeFromNewChats = (cb) => {
        newChatListeners.current = newChatListeners.current.filter(
            (listener) => listener !== cb
        );
    };

    const sendSocketMessage = (chatId, message, cb) => {
        if (socket.current === null) {
            return;
        }

        const data = decamelizeKeys({
            chatId,
            message,
        });

        socket.current?.emit("message", data, cb);
    };

    return (
        <ChatsContext.Provider
            value={{
                subscribeToChat,
                unsubscribeFromChat,
                sendSocketMessage,
                subscribeToNewChats,
                unsubscribeFromNewChats,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
}
