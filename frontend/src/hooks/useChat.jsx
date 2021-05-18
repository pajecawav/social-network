import { useContext, useEffect, useState } from "react";
import { getChat, getChatMessages } from "../api";
import { ChatsContext } from "../contexts/ChatsContext";

export function useChat(chatId) {
    const [isLoading, setIsLoading] = useState(true);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const { subscribeToChat, unsubscribeFromChat, sendSocketMessage } =
        useContext(ChatsContext);

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

        const handleChatEvent = (event, data) => {
            switch (event) {
                case "new_message":
                    setMessages((oldMessages) => [
                        ...oldMessages,
                        data.message,
                    ]);
                    break;
                case "message_edited": {
                    const { message: editedMessage } = data;
                    setMessages((oldMessages) =>
                        oldMessages.map((message) =>
                            message.messageId === editedMessage.messageId
                                ? editedMessage
                                : message
                        )
                    );
                    break;
                }
                case "messages_deleted": {
                    const messageIds = data;
                    setMessages((oldMessages) =>
                        oldMessages.filter(
                            (message) => !messageIds.includes(message.messageId)
                        )
                    );
                    break;
                }
                default:
                    throw new Error("Unknown chat event");
            }
        };

        subscribeToChat(chatId, handleChatEvent);
        return () => unsubscribeFromChat(chatId, handleChatEvent);
    }, [chatId, subscribeToChat, unsubscribeFromChat]);

    return { isLoading, chat, messages, sendSocketMessage };
}
