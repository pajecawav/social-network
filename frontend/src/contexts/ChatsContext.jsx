import { camelizeKeys, decamelizeKeys } from "humps";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react";
import { getSocket } from "../sockets";
import { UserContext } from "./UserContext";

export const ChatsContext = createContext();

export function ChatsProvider({ children }) {
    const { loggedIn } = useContext(UserContext);
    const socket = useRef(null);
    const listeners = useRef({});
    const newChatListeners = useRef([]);

    const notifyListeners = (chatId, event, data) => {
        listeners.current[chatId]?.forEach((listener) => listener(event, data));
    };

    useEffect(() => {
        const sio = getSocket("/chat");
        socket.current = sio;

        sio.on("new_message", (data) => {
            const { message, chatId } = camelizeKeys(data);
            notifyListeners(chatId, "new_message", { message, chatId });
            notifyListeners("*", "new_message", { message, chatId });
        });

        sio.on("message_edited", (data) => {
            const { message, chatId } = camelizeKeys(data);
            notifyListeners(chatId, "message_edited", { message, chatId });
            notifyListeners("*", "message_edited", { message, chatId });
        });

        sio.on("new_chat", (data) => {
            const chat = camelizeKeys(data);
            socket.current?.emit("join_chat", { chat_id: chat.chatId });
            newChatListeners.current.forEach((listener) => listener(chat));
        });

        sio.on("messages_deleted", (data) => {
            const { chatId, messageIds } = camelizeKeys(data);
            notifyListeners(chatId, "messages_deleted", messageIds);
            notifyListeners("*", "messages_deleted", messageIds);
        });

        return () => sio.disconnect();
    }, [loggedIn]);

    const subscribeToChat = useCallback((chatId, cb) => {
        const currentListeners = listeners.current[chatId];
        if (currentListeners) {
            currentListeners.push(cb);
        } else {
            listeners.current[chatId] = [cb];
        }
    }, []);

    const unsubscribeFromChat = useCallback((chatId, cb) => {
        const currentListeners = listeners.current[chatId];
        if (!currentListeners) return;
        listeners.current[chatId] = currentListeners.filter(
            (listener) => listener !== cb
        );
    }, []);

    const subscribeToNewChats = useCallback((cb) => {
        newChatListeners.current.push(cb);
    }, []);

    const unsubscribeFromNewChats = useCallback((cb) => {
        newChatListeners.current = newChatListeners.current.filter(
            (listener) => listener !== cb
        );
    }, []);

    const sendSocketMessage = useCallback((chatId, message, cb) => {
        if (socket.current === null) {
            return;
        }

        const data = decamelizeKeys({
            chatId,
            message,
        });

        socket.current.emit("new_message", data, cb);
    }, []);

    const joinChat = useCallback((chatId) => {
        socket.current?.emit("join_chat", { chat_id: chatId });
    }, []);

    return (
        <ChatsContext.Provider
            value={{
                subscribeToChat,
                unsubscribeFromChat,
                sendSocketMessage,
                subscribeToNewChats,
                unsubscribeFromNewChats,
                joinChat,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
}
