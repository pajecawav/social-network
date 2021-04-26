import { camelizeKeys, decamelizeKeys } from "humps";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { getChatMessages } from "../api";
import { getLocalToken } from "../utils";

export function useChat(chatId) {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        getChatMessages(chatId)
            .then((response) => {
                setMessages(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [chatId]);

    useEffect(() => {
        const sio = io("/chat", {
            path: "/api/ws/socket.io",
            auth: {
                token: getLocalToken(),
            },
            query: {
                chat_id: chatId,
            },
        });

        socketRef.current = sio;

        sio.on("message", (data) => {
            data = camelizeKeys(data);
            setMessages((messages) => [...messages, data]);
        });

        return () => sio.disconnect();
    }, [chatId]);

    const sendMessage = (text, cb) => {
        if (!text || socketRef.current === null) {
            return;
        }

        const data = decamelizeKeys({
            chatId,
            message: { text },
        });

        socketRef.current?.emit("message", data, cb);
    };

    return { socket: socketRef.current, isLoading, messages, sendMessage };
}
