import {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { deleteChatMessages, editMessage } from "../../api";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Container } from "../../components/Container";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { ChatContext } from "../../contexts/ChatContext";
import { UserContext } from "../../contexts/UserContext";
import { useChat } from "../../hooks/useChat";
import { useIsPageVisible } from "../../hooks/useIsPageVisible";
import { selectedMessagesReducer } from "../../reducers/selectedMessagesReducer";
import { Message } from "../../types";
import { Chat } from "./Chat";
import { ChatHeader } from "./ChatHeader";
import { EditMessageBlock } from "./EditMessageBlock";
import { GroupChatInfoModal } from "./GroupChatInfoModal";
import { InviteLinkModal } from "./InviteLinkModal";
import { InviteToChatModal } from "./InviteToChatModal";
import { MessagesActionsBlock } from "./MessagesActionsBlock";
import { SendMessageBlock } from "./SendMessageBlock";
import { UpdateGroupChatAvatarModal } from "./UpdateGroupChatAvatarModal";

type ChatPageProps = {
    chatId: number;
};

export const ChatPage = ({ chatId }: ChatPageProps) => {
    const { user } = useContext(UserContext);

    const chatHookValues = useChat(chatId);
    const {
        isLoading,
        chat,
        messages,
        sendSocketMessage,
        updateLastSeenMessage,
    } = chatHookValues;

    const [selectedMessages, dispatchSelectedMessages] = useReducer(
        selectedMessagesReducer,
        []
    );
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isInviteLinkOpen, setIsInviteLinkOpen] = useState(false);
    const [isDeleteMessagesOpen, setIsDeleteteMessagesOpen] = useState(false);
    const [isUpdateAvatarOpen, setIsUpdateAvatarOpen] = useState(false);

    const isPageVisible = useIsPageVisible();

    const isAdmin =
        user &&
        !isLoading &&
        chat &&
        chat.chatType === "group" &&
        chat.admin &&
        user.userId === chat.admin.userId;

    useEffect(() => {
        if (messages && isPageVisible) {
            updateLastSeenMessage(messages[messages.length - 1].messageId);
        }
    }, [messages, updateLastSeenMessage, isPageVisible]);

    const handleSendMessage = useCallback(
        (text) => {
            if (text) {
                sendSocketMessage(chatId, { text });
            }
        },
        [chatId, sendSocketMessage]
    );

    const handleEditMessage = useCallback(() => {
        if (editingMessage === null) return;

        editMessage(editingMessage.messageId, { text: editingMessage.text })
            .then(() => setEditingMessage(null))
            .catch(console.error);
    }, [editingMessage]);

    const handleDeleteSelectedMessages = useCallback(() => {
        if (selectedMessages.length === 0) return;
        deleteChatMessages(chatId, {
            messageIds: selectedMessages.map((msg) => msg.messageId),
        })
            .then(() => {
                dispatchSelectedMessages({ type: "reset" });
            })
            .catch(console.error);
    }, [chatId, selectedMessages]);

    return (
        <ChatContext.Provider value={chatHookValues}>
            <Container className="md:max-h-[calc(100vh-4rem)] h-full">
                {chat === null || isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <>
                        <div className="relative flex flex-col h-full">
                            <ChatHeader
                                onOpenChatInfo={() => setIsChatInfoOpen(true)}
                                onOpenInviteToChat={() =>
                                    setIsInviteToChatOpen(true)
                                }
                                onOpenInviteLink={() =>
                                    setIsInviteLinkOpen(true)
                                }
                                onOpenUpdateAvatar={() =>
                                    setIsUpdateAvatarOpen(true)
                                }
                            />
                            <Chat
                                isLoading={isLoading}
                                messages={messages!}
                                selectedMessages={
                                    editingMessage
                                        ? [editingMessage]
                                        : selectedMessages
                                }
                                onSelectMessage={(message) => {
                                    if (editingMessage !== null) {
                                        return;
                                    }
                                    dispatchSelectedMessages({
                                        type: "add_message",
                                        message,
                                    });
                                }}
                                onUnselectMessage={(message) => {
                                    dispatchSelectedMessages({
                                        type: "remove_message",
                                        messageId: message.messageId,
                                    });
                                }}
                            />

                            <div className="flex flex-col w-full gap-2 px-4 py-4 border-t bg-primary-700 border-primary-600">
                                {selectedMessages.length > 0 ? (
                                    <MessagesActionsBlock
                                        selectedMessages={selectedMessages}
                                        onUnselectAll={() =>
                                            dispatchSelectedMessages({
                                                type: "reset",
                                            })
                                        }
                                        onEditMessage={(message) => {
                                            dispatchSelectedMessages({
                                                type: "reset",
                                            });
                                            setEditingMessage(
                                                messages!.find(
                                                    (msg) =>
                                                        msg.messageId ===
                                                        message.messageId
                                                ) || null
                                            );
                                        }}
                                        onDeleteSelectedMessages={() =>
                                            setIsDeleteteMessagesOpen(true)
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
                                    <>
                                        <InviteLinkModal
                                            isOpen={isInviteLinkOpen}
                                            onRequestClose={() =>
                                                setIsInviteLinkOpen(false)
                                            }
                                        />
                                        <UpdateGroupChatAvatarModal
                                            isOpen={isUpdateAvatarOpen}
                                            onRequestClose={() =>
                                                setIsUpdateAvatarOpen(false)
                                            }
                                        />
                                    </>
                                )}
                            </>
                        )}

                        <ConfirmationModal
                            isOpen={isDeleteMessagesOpen}
                            confirmText="Delete"
                            title="Delete messages"
                            onConfirm={() => {
                                setIsDeleteteMessagesOpen(false);
                                handleDeleteSelectedMessages();
                            }}
                            onRequestClose={() =>
                                setIsDeleteteMessagesOpen(false)
                            }
                        >
                            Are you sure you want to delete{" "}
                            {selectedMessages.length} messages?
                        </ConfirmationModal>
                    </>
                )}
            </Container>
        </ChatContext.Provider>
    );
};
