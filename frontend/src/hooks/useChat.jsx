import { useContext, useEffect, useState } from "react";
import { getChat, getChatMessages } from "../api";
import { ChatsContext } from "../contexts/ChatsContext";

export function useChat(chatId) {
    const [isLoading, setIsLoading] = useState(true);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const {
        subscribeToChat,
        unsubscribeFromChat,
        sendSocketMessage,
    } = useContext(ChatsContext);

    useEffect(() => {
        setIsLoading(true);
        getChat(chatId)
            .then((response) => setChat(response.data))
            .catch(console.error);
        getChatMessages(chatId)
            .then((response) => {
                setMessages(response.data);
                setIsLoading(false);
            })
            .catch(console.error);

        const handleNewMessage = (message) => {
            setMessages((oldMessages) => [...oldMessages, message]);
        };
        subscribeToChat(chatId, handleNewMessage);
        return () => unsubscribeFromChat(chatId, handleNewMessage);
    }, [chatId, subscribeToChat, unsubscribeFromChat]);

    return { isLoading, chat, messages, sendSocketMessage };
}
