import { camelizeKeys, decamelizeKeys } from "humps";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { getChat, getChatMessages } from "../api";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getLocalToken } from "../utils";

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
                {chat?.title}
            </div>

            <div className="w-20 mr-4" />
        </div>
    );
}

function ChatMessage({ message }) {
    return (
        <div>
            <Link
                className="text-purple-600 hover:underline"
                to={`/users/${message.user.userId}`}
            >
                {message.user.firstName} {message.user.lastName}
            </Link>
            <span>: {message.text}</span>
        </div>
    );
}

export function ChatPage({ chatId }) {
    const [chat, setChat] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);
    const messagesEnd = useRef(null);

    useEffect(() => {
        getChat(chatId)
            .then((response) => setChat(response.data))
            .catch(console.error);

        getChatMessages(chatId)
            .then((response) => {
                setMessages(response.data);
                messagesEnd.current.scrollIntoView();
            })
            .catch(console.error);
    }, [chatId]);

    useEffect(() => {
        const sio = io("/chat", {
            path: "/api/ws/socket.io",
            auth: {
                token: getLocalToken(),
            },
            query: {
                chat_id: chatId,
            },
        });

        socket.current = sio;

        sio.on("message", (data) => {
            data = camelizeKeys(data);
            setMessages((messages) => [...messages, data]);
            scrollToBottom();
        });

        return () => sio.disconnect();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = (event) => {
        event.preventDefault();

        if (!text || socket.current === null) {
            return;
        }

        const data = decamelizeKeys({
            chatId,
            message: { text },
        });

        socket.current.emit("message", data, () => {
            setText("");
        });
    };

    return (
        <Container>
            {chat === null ? (
                <LoadingPlaceholder />
            ) : (
                <div className="flex flex-col gap-2">
                    <ChatHeader chat={chat} />

                    {/* TODO: implement better scrolling (scrollbar should be at the right of the page */}
                    <div className="flex flex-col max-h-80 gap-2 px-4 overflow-y-auto">
                        {messages.map((message) => (
                            <ChatMessage
                                message={message}
                                key={message.messageId}
                            />
                        ))}
                        <div ref={messagesEnd} />
                    </div>

                    <form
                        className="flex gap-4 px-4 pb-4"
                        onSubmit={sendMessage}
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
