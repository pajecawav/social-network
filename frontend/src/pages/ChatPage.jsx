import { ChevronDownIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import { getChat } from "../api";
import { Chat } from "../components/Chat";
import { ChatHeader } from "../components/ChatHeader";
import { Container } from "../components/Container";
import { GroupChatInfoModal } from "../components/GroupChatInfoModal";
import { InviteToChatModal } from "../components/InviteToChatModal";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { useChat } from "../hooks/useChat";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function ChatPage({ chatId }) {
    const [chat, setChat] = useState(null);
    const { isLoading, messages, sendMessage } = useChat(chatId);

    const [text, setText] = useState("");
    const messagesEnd = useRef(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);
    const [isInviteToChatOpen, setIsInviteToChatOpen] = useState(false);
    const [isScrollAnchored, setIsScrollAnchored] = useState(true);

    useEffect(() => {
        getChat(chatId)
            .then((response) => setChat(response.data))
            .catch(console.error);
    }, [chatId]);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom("auto");
        }
    }, [isLoading]);

    useEffect(() => {
        if (isScrollAnchored) {
            scrollToBottom();
        }
    }, [messages, isScrollAnchored]);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEnd.current?.scrollIntoView({ behavior });
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (text) {
            sendMessage(text, () => setText(""));
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
            {chat === null ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <div className="flex flex-col">
                        <ChatHeader
                            chat={chat}
                            onOpenChatInfo={handleOpenChatInfo}
                            onInviteToChat={handleOpenInviteToChat}
                        />

                        {/* TODO: implement better scrolling (scrollbar should be at the right of the page) */}
                        <div className="flex flex-col max-h-80 gap-2 px-4 py-4 overflow-y-auto">
                            {isLoading && <LoadingPlaceholder />}
                            <Chat messages={messages} />
                            <Waypoint
                                bottomOffset={-50}
                                onEnter={() => setIsScrollAnchored(true)}
                                onLeave={() => setIsScrollAnchored(false)}
                            >
                                <div className="h-px" ref={messagesEnd} />
                            </Waypoint>
                            <button
                                className={clsx(
                                    "sticky w-10 h-10 ml-auto bottom-0 p-1 rounded-full shadow-xl border text-secondary-500 bg-primary-700 border-primary-600 bg-opacity-30 transform-colors duration-200 outline-none hover:bg-primary-600",
                                    isScrollAnchored
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100 pointer-events-auto"
                                )}
                                onClick={() => scrollToBottom("auto")}
                            >
                                <ChevronDownIcon />
                            </button>
                        </div>

                        <form
                            className="flex gap-4 px-4 py-4"
                            onSubmit={handleSendMessage}
                        >
                            <Input
                                className="flex-grow"
                                type="text"
                                placeholder="Write a message"
                                value={text}
                                onChange={(event) =>
                                    setText(event.target.value)
                                }
                            />
                            <Button>Send</Button>
                        </form>
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
