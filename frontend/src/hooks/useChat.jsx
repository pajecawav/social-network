import { useContext, useEffect, useState } from "react";
import { getChat, getChatMessages, getChatUsers } from "../api";
import { ChatsContext } from "../contexts/ChatsContext";

export function useChat(chatId) {
    const [isChatLoading, setIsChatLoading] = useState(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(true);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [users, setUsers] = useState(null);
    const { subscribeToChat, unsubscribeFromChat, sendSocketMessage } =
        useContext(ChatsContext);

    useEffect(() => {
        setIsChatLoading(true);
        setIsMessagesLoading(true);
        setIsUsersLoading(true);

        // TODO: this probably should be a single request
        getChat(chatId)
            .then((response) => {
                setChat(response.data);
                setIsChatLoading(false);
            })
            .catch(console.error);
        getChatMessages(chatId)
            .then((response) => {
                setMessages(response.data);
                setIsMessagesLoading(false);
            })
            .catch(console.error);

        if (chat.chatType === "group") {
            getChatUsers(chatId)
                .then((response) => {
                    setUsers(response.data);
                    setIsUsersLoading(false);
                })
                .catch(console.error);
        } else {
            setIsUsersLoading(false);
        }

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

    // TODO: should this function also make an API request?
    const removeUser = (userId) => {
        setUsers((oldUsers) =>
            oldUsers.filter((user) => user.userId !== userId)
        );
    };

    return {
        isLoading: isChatLoading || isMessagesLoading || isUsersLoading,
        chat,
        messages,
        users,
        sendSocketMessage,
        removeUser,
    };
}
