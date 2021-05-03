import React, { useEffect, useRef, useState } from "react";
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
        scrollToBottom();
    }, [messages]);

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
                            <div ref={messagesEnd} />
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
