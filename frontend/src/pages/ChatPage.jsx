import {
    CheckCircleIcon,
    ChevronDownIcon,
    XIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import { deleteMessage, editMessage } from "../api";
import { Chat } from "../components/Chat";
import { ChatHeader } from "../components/ChatHeader";
import { Container } from "../components/Container";
import { GroupChatInfoModal } from "../components/GroupChatInfoModal";
import { InviteToChatModal } from "../components/InviteToChatModal";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { useChat } from "../hooks/useChat";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ReactComponent as SendIcon } from "../icons/send.svg";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

function MessagesActionsBlock({
    selectedMessages,
    onUnselectAll,
    onEditMessage,
    onDeleteSelectedMessages,
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex text-primary-400">
                <div>Selected {selectedMessages.length} messages</div>
                <div className="flex w-8 ml-auto items-center justify-center">
                    <XIcon
                        className="inline w-6 text-primary-500 cursor-pointer transition-colors duration-100 hover:text-primary-400"
                        onClick={onUnselectAll}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    disabled={selectedMessages.length > 1}
                    onClick={() => onEditMessage(selectedMessages[0])}
                >
                    Edit
                </Button>
                {/* TODO: implement replies */}
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    disabled={true}
                >
                    Reply
                </Button>
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    // TODO: remove this after adding an API endpoint for deleting multiple messages
                    disabled={selectedMessages.length > 1}
                    onClick={onDeleteSelectedMessages}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

function SendMessageBlock({ onSubmit }) {
    const [text, setText] = useState("");
    const isSmallScreen = useIsSmallScreen();

    const handleSendMessage = (event) => {
        event.preventDefault();
        onSubmit(text);
        setText("");
    };

    return (
        <form className="flex gap-4" onSubmit={handleSendMessage}>
            <Input
                className="flex-grow"
                type="text"
                placeholder="Write a message"
                value={text}
                onChange={(event) => {
                    setText(event.target.value);
                }}
            />
            {isSmallScreen ? (
                <button className="w-8 text-secondary-600">
                    <SendIcon />
                </button>
            ) : (
                <Button>Send</Button>
            )}
        </form>
    );
}

function EditMessageBlock({ message, setMessage, onCancel, onSubmit }) {
    const isSmallScreen = useIsSmallScreen();

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full gap-2">
                <div>Edit</div>
                <button
                    className="text-secondary-500 cursor-pointer hover:underline"
                    onClick={() => {
                        document
                            .getElementById(`message_${message.messageId}`)
                            ?.scrollIntoView();
                    }}
                >
                    message
                </button>
                <div className="flex w-8 ml-auto items-center justify-center">
                    <XIcon
                        className="inline w-6 text-primary-500 cursor-pointer transition-colors duration-100 hover:text-primary-400"
                        onClick={onCancel}
                    />
                </div>
            </div>
            <form className="flex gap-4" onSubmit={handleSubmit}>
                <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Write a message"
                    value={message.text}
                    onChange={(event) => {
                        setMessage({
                            ...message,
                            text: event.target.value,
                        });
                    }}
                />
                {isSmallScreen ? (
                    <button className="w-8 text-secondary-600">
                        <CheckCircleIcon />
                    </button>
                ) : (
                    <Button>Save</Button>
                )}
            </form>
        </div>
    );
}

export function ChatPage({ chatId }) {
    const { isLoading, chat, messages, sendSocketMessage } = useChat(chatId);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const messagesEnd = useRef(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isScrollAnchored, setIsScrollAnchored] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [isLoading]);

    useEffect(() => {
        if (isScrollAnchored) {
            scrollToBottom();
        }
        // eslint-disable-next-line
    }, [messages]);

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView();
    };

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

    const handleOpenChatInfo = () => {
        setIsChatInfoOpen(true);
    };

    const handleOpenInviteToChat = () => {
        setIsInviteToChatOpen(true);
    };

    return (
        <Container>
            {chat === null || isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <div className="relative flex flex-col">
                        <ChatHeader
                            chat={chat}
                            onOpenChatInfo={handleOpenChatInfo}
                            onOpenInviteToChat={handleOpenInviteToChat}
                        />

                        {/* TODO: implement better scrolling (scrollbar should be at the right of the page) */}
                        <div className="flex flex-col ml-4 pr-2 pt-4 overflow-y-auto max-h-80">
                            {isLoading && <LoadingPlaceholder />}
                            <Chat
                                messages={messages}
                                selectedMessages={
                                    editingMessage
                                        ? [editingMessage.messageId]
                                        : selectedMessages
                                }
                                onSelectMessage={(message) => {
                                    if (
                                        selectedMessages.includes(
                                            message.messageId
                                        )
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
                            <Waypoint
                                bottomOffset={-50}
                                onEnter={() => setIsScrollAnchored(true)}
                                onLeave={() => setIsScrollAnchored(false)}
                            >
                                <div className="h-px" ref={messagesEnd} />
                            </Waypoint>
                            <button
                                className={clsx(
                                    "absolute z-20 w-10 h-10 ml-auto right-10 p-1 rounded-full border text-secondary-800 bg-primary-700 border-primary-600 transform-colors duration-200 outline-none focus:outline-none hover:bg-primary-600",
                                    editingMessage === null
                                        ? "bottom-20"
                                        : "bottom-28",
                                    isScrollAnchored
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100 pointer-events-auto"
                                )}
                                onClick={scrollToBottom}
                            >
                                <ChevronDownIcon />
                            </button>
                        </div>

                        <div className="flex flex-col px-4 py-4 gap-2">
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
