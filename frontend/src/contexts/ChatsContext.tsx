import { camelizeKeys, decamelizeKeys } from "humps";
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../sockets";
import { Chat, Message } from "../types";
import { UserContext } from "./UserContext";

type ChatsContextValues = {
    subscribeToChat: (
        chatId: ChatIdKey,
        cb: (event: string, data: any) => void
    ) => void;
    unsubscribeFromChat: (
        chatId: ChatIdKey,
        cb: (event: string, data: any) => void
    ) => void;
    sendSocketMessage: (
        chatId: number,
        message: { text: string },
        cb?: () => void
    ) => void;
    subscribeToNewChats: (cb: (chat: Chat) => void) => void;
    unsubscribeFromNewChats: (cb: (chat: Chat) => void) => void;
    joinChat: (chatId: number) => void;
    updateLastSeenMessage: (chatId: number, messageId: number) => void;
};

type ChatIdKey = number | "*";

type ChatEventListener = (event: string, data: any) => void;

type NewChatListener = (chat: Chat) => void;

export const ChatsContext = createContext<ChatsContextValues>(
    {} as ChatsContextValues
);

export const ChatsProvider = ({ children }: PropsWithChildren<{}>) => {
    const { loggedIn } = useContext(UserContext);
    const socket = useRef<Socket | null>(null);
    const listeners = useRef<Record<ChatIdKey, ChatEventListener[]>>({} as any);
    const newChatListeners = useRef<NewChatListener[]>([]);

    // TODO: proper typing for events and data with overloads
    const notifyListeners = (chatId: ChatIdKey, event: string, data: any) => {
        listeners.current[chatId]?.forEach((listener) => listener(event, data));
    };

    useEffect(() => {
        const sio = getSocket("/chat");
        socket.current = sio;

        sio.on("new_message", (data: Record<string, string>) => {
            const { message, chatId } = camelizeKeys(data) as {
                message: Message;
                chatId: number;
            };
            notifyListeners(chatId, "new_message", { message, chatId });
            notifyListeners("*", "new_message", { message, chatId });
        });

        sio.on("message_edited", (data: Record<string, string>) => {
            const { message, chatId } = camelizeKeys(data) as {
                message: Message;
                chatId: number;
            };
            notifyListeners(chatId, "message_edited", { message, chatId });
            notifyListeners("*", "message_edited", { message, chatId });
        });

        sio.on("new_chat", (data: Record<string, string>) => {
            const chat = camelizeKeys(data) as Chat;
            socket.current?.emit("join_chat", { chat_id: chat.chatId });
            newChatListeners.current.forEach((listener) => listener(chat));
        });

        sio.on("messages_deleted", (data: Record<string, string>) => {
            const { chatId, messageIds } = camelizeKeys(data) as {
                chatId: number;
                messageIds: number[];
            };
            notifyListeners(chatId, "messages_deleted", messageIds);
            notifyListeners("*", "messages_deleted", messageIds);
        });

        return () => {
            sio.disconnect();
        };
    }, [loggedIn]);

    const subscribeToChat = useCallback(
        (chatId: ChatIdKey, cb: (event: string, data: any) => void) => {
            const currentListeners = listeners.current[chatId];
            if (currentListeners) {
                currentListeners.push(cb);
            } else {
                listeners.current[chatId] = [cb];
            }
        },
        []
    );

    const unsubscribeFromChat = useCallback(
        (chatId: ChatIdKey, cb: (event: string, data: any) => void) => {
            const currentListeners = listeners.current[chatId];
            if (!currentListeners) return;
            listeners.current[chatId] = currentListeners.filter(
                (listener) => listener !== cb
            );
        },
        []
    );

    const subscribeToNewChats = useCallback((cb: (chat: Chat) => void) => {
        newChatListeners.current.push(cb);
    }, []);

    const unsubscribeFromNewChats = useCallback((cb: (chat: Chat) => void) => {
        newChatListeners.current = newChatListeners.current.filter(
            (listener) => listener !== cb
        );
    }, []);

    const sendSocketMessage = useCallback(
        (chatId: number, message: { text: string }, cb?: () => void) => {
            if (socket.current === null) {
                return;
            }

            const data = decamelizeKeys({
                chatId,
                message,
            });

            socket.current.emit("new_message", data, cb);
        },
        []
    );

    const joinChat = useCallback((chatId) => {
        socket.current?.emit("join_chat", { chat_id: chatId });
    }, []);

    const updateLastSeenMessage = useCallback((chatId, messageId) => {
        socket.current?.emit("update_last_seen_message", {
            chat_id: chatId,
            message_id: messageId,
        });
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
                updateLastSeenMessage,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
};
