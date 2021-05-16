import {
    CheckCircleIcon,
    ChevronDownIcon,
    XIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import { editMessage } from "../api";
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

export function ChatPage({ chatId }) {
    const { isLoading, chat, messages, sendSocketMessage } = useChat(chatId);
    const [text, setText] = useState("");
    const [editingMessage, setEditingMessage] = useState(null);
    const messagesEnd = useRef(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isScrollAnchored, setIsScrollAnchored] = useState(true);
    const isSmallScreen = useIsSmallScreen();

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

    const handleSendMessage = (event) => {
        event.preventDefault();

        if (editingMessage !== null) {
            editMessage(editingMessage.messageId, editingMessage)
                .then(() => setEditingMessage(null))
                .catch(console.error);
            return;
        }

        if (text) {
            sendSocketMessage(chatId, { text }, () => setText(""));
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
                        <div className="flex flex-col mx-4 pt-4 overflow-y-auto max-h-80">
                            {isLoading && <LoadingPlaceholder />}
                            <Chat
                                messages={messages}
                                activeMessages={
                                    editingMessage
                                        ? [editingMessage.messageId]
                                        : []
                                }
                                onEditMessage={(message) =>
                                    setEditingMessage(message)
                                }
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
                            {editingMessage && (
                                <div className="flex w-full">
                                    <div>
                                        Edit{" "}
                                        <button
                                            className="text-secondary-500 cursor-pointer hover:underline"
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        `message_${editingMessage.messageId}`
                                                    )
                                                    ?.scrollIntoView();
                                            }}
                                        >
                                            message
                                        </button>
                                    </div>
                                    <div className="flex w-8 ml-auto items-center justify-center">
                                        <XIcon
                                            className="inline w-6 text-primary-500 cursor-pointer transition-colors duration-100 hover:text-primary-400"
                                            onClick={() =>
                                                setEditingMessage(null)
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            <form
                                className="flex gap-4"
                                onSubmit={handleSendMessage}
                            >
                                <Input
                                    className="flex-grow"
                                    type="text"
                                    placeholder="Write a message"
                                    value={editingMessage?.text || text}
                                    onChange={(event) => {
                                        if (editingMessage === null) {
                                            setText(event.target.value);
                                        } else {
                                            setEditingMessage({
                                                ...editingMessage,
                                                text: event.target.value,
                                            });
                                        }
                                    }}
                                />
                                {isSmallScreen ? (
                                    <button className="w-8 text-secondary-600">
                                        {editingMessage ? (
                                            <CheckCircleIcon />
                                        ) : (
                                            <SendIcon />
                                        )}
                                    </button>
                                ) : (
                                    <Button>
                                        {editingMessage ? "Save" : "Send"}
                                    </Button>
                                )}
                            </form>
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
