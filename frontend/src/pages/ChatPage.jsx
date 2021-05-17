import React, { useState } from "react";
import { deleteMessage, editMessage } from "../api";
import { Chat } from "../components/Chat";
import { ChatHeader } from "../components/ChatHeader";
import { Container } from "../components/Container";
import { EditMessageBlock } from "../components/EditMessageBlock";
import { GroupChatInfoModal } from "../components/GroupChatInfoModal";
import { InviteToChatModal } from "../components/InviteToChatModal";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { MessagesActionsBlock } from "../components/MessagesActionsBlock";
import { useChat } from "../hooks/useChat";

export function ChatPage({ chatId }) {
    const { isLoading, chat, messages, sendSocketMessage } = useChat(chatId);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);

    const handleSendMessage = (text) => {
        if (text) {
            sendSocketMessage(chatId, { text });
        }
    };

    const handleEditMessage = () => {
        editMessage(editingMessage.messageId, editingMessage)
            .then(() => setEditingMessage(null))
            .catch(console.error);
    };

    const handleDeleteSelectedMessages = () => {
        if (selectedMessages.length === 0) return;
        // TODO: remove the for loop
        for (let messageId of selectedMessages) {
            deleteMessage(messageId);
        }
    };

    return (
        <Container>
            {chat === null || isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <div className="flex flex-col">
                        <ChatHeader
                            chat={chat}
                            onOpenChatInfo={() => setIsChatInfoOpen(true)}
                            onOpenInviteToChat={() =>
                                setIsInviteToChatOpen(true)
                            }
                        />
                        <Chat
                            isLoading={isLoading}
                            messages={messages}
                            selectedMessages={
                                editingMessage
                                    ? [editingMessage.messageId]
                                    : selectedMessages
                            }
                            onSelectMessage={(message) => {
                                if (
                                    selectedMessages.includes(message.messageId)
                                ) {
                                    return;
                                }
                                setSelectedMessages([
                                    ...selectedMessages,
                                    message.messageId,
                                ]);
                            }}
                            onUnselectMessage={(message) => {
                                setSelectedMessages(
                                    selectedMessages.filter(
                                        (messageId) =>
                                            messageId !== message.messageId
                                    )
                                );
                            }}
                        />

                        <div className="flex flex-col px-4 py-4 gap-2 border-t border-primary-600">
                            {selectedMessages.length > 0 ? (
                                <MessagesActionsBlock
                                    selectedMessages={selectedMessages}
                                    onUnselectAll={() =>
                                        setSelectedMessages([])
                                    }
                                    onEditMessage={(messageId) => {
                                        setSelectedMessages([]);
                                        setEditingMessage(
                                            messages.find(
                                                (msg) =>
                                                    msg.messageId === messageId
                                            )
                                        );
                                    }}
                                    onDeleteSelectedMessages={
                                        handleDeleteSelectedMessages
                                    }
                                />
                            ) : editingMessage === null ? (
                                <SendMessageBlock
                                    onSubmit={handleSendMessage}
                                />
                            ) : (
                                <EditMessageBlock
                                    message={editingMessage}
                                    setMessage={setEditingMessage}
                                    onCancel={() => setEditingMessage(null)}
                                    onSubmit={handleEditMessage}
                                />
                            )}
                        </div>
                    </div>

                    {chat.chatType === "group" && (
                        <>
                            <GroupChatInfoModal
                                chat={chat}
                                isOpen={isChatInfoOpen}
                                onRequestClose={() => setIsChatInfoOpen(false)}
                            />
                            <InviteToChatModal
                                chat={chat}
                                isOpen={isInviteToChatOpen}
                                onRequestClose={() =>
                                    setIsInviteToChatOpen(false)
                                }
                            />
                        </>
                    )}
                </>
            )}
        </Container>
    );
}
