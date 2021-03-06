import { useCallback, useContext, useEffect, useState } from "react";
import { getChat, getChatMessages, getChatUsers } from "../api";
import { ChatsContext } from "../contexts/ChatsContext";
import { Chat, Message, User } from "../types";

export const useChat = (chatId: number) => {
    const [isChatLoading, setIsChatLoading] = useState(true);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(false);

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const {
        subscribeToChat,
        unsubscribeFromChat,
        sendSocketMessage,
        updateLastSeenMessage: updateLastSeenMessageImpl,
    } = useContext(ChatsContext);

    useEffect(() => {
        setIsChatLoading(true);
        setIsMessagesLoading(true);

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

        const handleChatEvent = (event: string, data: any) => {
            switch (event) {
                case "new_message":
                    setMessages((oldMessages) => [
                        ...(oldMessages || []),
                        data.message,
                    ]);
                    break;
                case "message_edited": {
                    const { message: editedMessage } = data;
                    setMessages((oldMessages) =>
                        (oldMessages || []).map((message) =>
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
                        (oldMessages || []).filter(
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

    useEffect(() => {
        if (chat?.chatType === "group") {
            setIsUsersLoading(true);
            getChatUsers(chat.chatId)
                .then((response) => {
                    setUsers(response.data);
                    setIsUsersLoading(false);
                })
                .catch(console.error);
        }
    }, [chat]);

    // TODO: should this function also make an API request?
    const removeUser = useCallback((userId) => {
        setUsers((oldUsers) =>
            (oldUsers || []).filter((user) => user.userId !== userId)
        );
    }, []);

    const updateLastSeenMessage = useCallback(
        (messageId) => {
            updateLastSeenMessageImpl(chatId, messageId);
        },
        [chatId, updateLastSeenMessageImpl]
    );

    return {
        isLoading: isChatLoading || isMessagesLoading || isUsersLoading,
        chat,
        messages,
        users,
        sendSocketMessage,
        removeUser,
        updateLastSeenMessage,
    };
};
