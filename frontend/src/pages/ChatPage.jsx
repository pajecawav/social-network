import React, { useContext, useState } from "react";
import { deleteChatMessages, editMessage } from "../api";
import { Chat } from "../components/Chat";
import { ChatHeader } from "../components/ChatHeader";
import { Container } from "../components/Container";
import { EditMessageBlock } from "../components/EditMessageBlock";
import { GroupChatInfoModal } from "../components/GroupChatInfoModal";
import { InviteLinkModal } from "../components/InviteLinkModal";
import { InviteToChatModal } from "../components/InviteToChatModal";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { MessagesActionsBlock } from "../components/MessagesActionsBlock";
import { SendMessageBlock } from "../components/SendMessageBlock";
import { UserContext } from "../contexts/UserContext";
import { useChat } from "../hooks/useChat";

export function ChatPage({ chatId }) {
    const { user } = useContext(UserContext);
    const { isLoading, chat, messages, sendSocketMessage } = useChat(chatId);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isInviteLinkOpen, setIsInviteLinkOpen] = useState(false);

    const isAdmin = !isLoading && user.userId === chat.admin.userId;

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
        deleteChatMessages(chatId, {
            messageIds: selectedMessages.map((msg) => msg.messageId),
        })
            .then(() => setSelectedMessages([]))
            .catch(console.error);
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
                            onOpenInviteLink={() => setIsInviteLinkOpen(true)}
                        />
                        <Chat
                            isLoading={isLoading}
                            messages={messages}
                            selectedMessages={
                                editingMessage
                                    ? [editingMessage]
                                    : selectedMessages
                            }
                            onSelectMessage={(message) => {
                                if (
                                    selectedMessages.findIndex(
                                        (msg) =>
                                            msg.messageId === message.messageId
                                    ) !== -1
                                ) {
                                    return;
                                }
                                setSelectedMessages([
                                    ...selectedMessages,
                                    message,
                                ]);
                            }}
                            onUnselectMessage={(message) => {
                                setSelectedMessages(
                                    selectedMessages.filter(
                                        (msg) =>
                                            msg.messageId !== message.messageId
                                    )
                                );
                            }}
                        />

                        <div className="flex flex-col gap-2 px-4 py-4 border-t border-primary-600">
                            {selectedMessages.length > 0 ? (
                                <MessagesActionsBlock
                                    selectedMessages={selectedMessages}
                                    onUnselectAll={() =>
                                        setSelectedMessages([])
                                    }
                                    onEditMessage={(message) => {
                                        setSelectedMessages([]);
                                        setEditingMessage(
                                            messages.find(
                                                (msg) =>
                                                    msg.messageId ===
                                                    message.messageId
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
                            {isAdmin && (
                                <InviteLinkModal
                                    chat={chat}
                                    isOpen={isInviteLinkOpen}
                                    onRequestClose={() =>
                                        setIsInviteLinkOpen(false)
                                    }
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </Container>
    );
}
