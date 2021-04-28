import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getChat } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { useChat } from "../hooks/useChat";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getChatTitle } from "../utils";

function ChatHeader({ chat }) {
    return (
        <div className="flex items-center h-12 border-b">
            <Link
                className="flex w-20 items-center px-4 h-full py-2 text-gray-400 text-center transition-all duration-200 hover:bg-gray-200 hover:bg-opacity-40"
                to="/chats"
            >
                Back
            </Link>

            <div className="flex-grow text-semibold text-center">
                {getChatTitle(chat)}
            </div>

            <div className="w-20 mr-4" />
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
                    <Link
                        className="text-purple-600 hover:underline"
                        to={`/users/${message.user.userId}`}
                    >
                        {message.user.firstName}
                    </Link>
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

    return (
        <Container>
            {chat === null ? (
                <LoadingPlaceholder />
            ) : (
                <div className="flex flex-col gap-4">
                    <ChatHeader chat={chat} />

                    {/* TODO: implement better scrolling (scrollbar should be at the right of the page */}
                    <div className="flex flex-col max-h-80 gap-2 px-4 overflow-y-auto">
                        {isLoading && <LoadingPlaceholder />}
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.messageId}
                                message={message}
                                showUser={
                                    index === 0 ||
                                    message.user.userId !==
                                        messages[index - 1].user.userId
                                }
                            />
                        ))}
                        <div ref={messagesEnd} />
                    </div>

                    <form
                        className="flex gap-4 px-4 pb-4"
                        onSubmit={handleSendMessage}
                    >
                        <Input
                            className="flex-grow"
                            type="text"
                            placeholder="Write a message"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                        />
                        <Button>Send</Button>
                    </form>
                </div>
            )}
        </Container>
    );
}
