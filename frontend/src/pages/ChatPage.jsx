import { useCallback, useContext, useState } from "react";
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
import { ChatContext } from "../contexts/ChatContext";
import { UserContext } from "../contexts/UserContext";
import { useChat } from "../hooks/useChat";

export function ChatPage({ chatId }) {
    const { user } = useContext(UserContext);

    const chatHookValues = useChat(chatId);
    const { isLoading, chat, messages, sendSocketMessage } = chatHookValues;

    const [selectedMessages, setSelectedMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isInviteLinkOpen, setIsInviteLinkOpen] = useState(false);

    const isAdmin =
        !isLoading && chat.admin && user.userId === chat.admin.userId;

    const handleSendMessage = useCallback(
        (text) => {
            if (text) {
                sendSocketMessage(chatId, { text });
            }
        },
        [chatId, sendSocketMessage]
    );

    const handleEditMessage = useCallback(() => {
        editMessage(editingMessage.messageId, editingMessage)
            .then(() => setEditingMessage(null))
            .catch(console.error);
    }, [editingMessage]);

    const handleDeleteSelectedMessages = useCallback(() => {
        if (selectedMessages.length === 0) return;
        deleteChatMessages(chatId, {
            messageIds: selectedMessages.map((msg) => msg.messageId),
        })
            .then(() => setSelectedMessages([]))
            .catch(console.error);
    }, [chatId, selectedMessages]);

    return (
        <ChatContext.Provider value={chatHookValues}>
            <Container>
                {chat === null || isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <>
                        <div className="flex flex-col">
                            <ChatHeader
                                onOpenChatInfo={() => setIsChatInfoOpen(true)}
                                onOpenInviteToChat={() =>
                                    setIsInviteToChatOpen(true)
                                }
                                onOpenInviteLink={() =>
                                    setIsInviteLinkOpen(true)
                                }
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
                                                msg.messageId ===
                                                message.messageId
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
                                                msg.messageId !==
                                                message.messageId
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
                                    isOpen={isChatInfoOpen}
                                    onRequestClose={() =>
                                        setIsChatInfoOpen(false)
                                    }
                                />
                                <InviteToChatModal
                                    isOpen={isInviteToChatOpen}
                                    onRequestClose={() =>
                                        setIsInviteToChatOpen(false)
                                    }
                                />
                                {isAdmin && (
                                    <InviteLinkModal
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
        </ChatContext.Provider>
    );
}
