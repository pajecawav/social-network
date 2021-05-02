import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getChat } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { GroupChatInfoModal } from "../components/GroupChatInfoModal";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { useChat } from "../hooks/useChat";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getChatTitle } from "../utils";

function ChatHeader({ chat, onOpenChatInfo }) {
    const isGroupChat = chat.chatType === "group";

    const handleAvatarClick = (event) => {
        event.preventDefault();
        onOpenChatInfo();
    };

    const avatar = <CircleAvatar className="ml-auto cursor-pointer" size={2} />;

    return (
        <div className="flex items-center h-12 border-b border-primary-700">
            <Link
                className="flex w-20 items-center px-4 h-full py-2 text-primary-200 text-center transition-all duration-200 hover:bg-primary-700"
                to="/chats"
            >
                Back
            </Link>

            <div className="flex-grow text-semibold text-center">
                {getChatTitle(chat)}
            </div>

            <div className="w-20 mr-4">
                {isGroupChat ? (
                    <div onClick={handleAvatarClick}>{avatar}</div>
                ) : (
                    <Link to={`/users/${chat.peer.userId}`}>{avatar}</Link>
                )}
            </div>
        </div>
    );
}

function ChatMessage({ message, showUser = true }) {
    return (
        <div className="flex gap-2">
            <div className={clsx("w-10", showUser && "h-10")}>
                {showUser && (
                    <Link to={`/users/${message.user.userId}`}>
                        <CircleAvatar className="object-contain" size={2} />
                    </Link>
                )}
            </div>

            <div className="flex flex-col">
                {showUser && (
                    <div>
                        <Link
                            className="text-secondary-500 hover:underline"
                            to={`/users/${message.user.userId}`}
                        >
                            {message.user.firstName}
                        </Link>
                        <span className="ml-2 text-xs text-primary-500">
                            {dayjs(message.timeSent).format("HH:mm")}
                        </span>
                    </div>
                )}

                <div>{message.text}</div>
            </div>
        </div>
    );
}

export function ChatPage({ chatId }) {
    const [chat, setChat] = useState(null);
    const { isLoading, messages, sendMessage } = useChat(chatId);

    const [text, setText] = useState("");
    const messagesEnd = useRef(null);
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false);

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
        if (chat.chatType !== "group") {
            return;
        }

        setIsChatInfoOpen(true);
    };

    let previousDate = null;
    const now = dayjs();
    const renderedMessages = messages.map((message, index) => {
        const sentDate = dayjs(message.timeSent);
        const shouldDisplayDate =
            previousDate === null || sentDate.diff(previousDate, "day") > 0;

        previousDate = sentDate;

        return (
            <React.Fragment key={message.messageId}>
                {shouldDisplayDate && (
                    <div className="mx-auto font-sm text-primary-500">
                        {sentDate.format(
                            now.year() === sentDate.year()
                                ? "MMMM D"
                                : "D MMMM, YYYY"
                        )}
                    </div>
                )}
                <ChatMessage
                    message={message}
                    showUser={
                        index === 0 ||
                        message.user.userId !== messages[index - 1].user.userId
                    }
                />
            </React.Fragment>
        );
    });

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
                        />

                        {/* TODO: implement better scrolling (scrollbar should be at the right of the page) */}
                        <div className="flex flex-col max-h-80 gap-2 px-4 py-4 overflow-y-auto">
                            {isLoading && <LoadingPlaceholder />}
                            {renderedMessages}
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
                        <GroupChatInfoModal
                            chat={chat}
                            isOpen={isChatInfoOpen}
                            onRequestClose={() => setIsChatInfoOpen(false)}
                        />
                    )}
                </>
            )}
        </Container>
    );
}
