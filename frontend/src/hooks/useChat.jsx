import { camelizeKeys, decamelizeKeys } from "humps";
import { useEffect, useRef, useState } from "react";
import { getChatMessages } from "../api";
import { getSocket } from "../sockets";

export function useChat(chatId) {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    chatId = parseInt(chatId);

    useEffect(() => {
        setIsLoading(true);
        getChatMessages(chatId)
            .then((response) => {
                setMessages(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [chatId]);

    useEffect(() => {
        const sio = getSocket("/chat", { chatId });
        socketRef.current = sio;

        sio.on("message", (data) => {
            const { message, chatId: chatId_ } = camelizeKeys(data);
            if (chatId_ !== chatId) {
                return;
            }
            setMessages((messages) => [...messages, message]);
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
