import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteChat, getChats } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { CreateChatModal } from "../components/CreateChatModal";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingContentWrapper } from "../components/LoadingContentWrapper";
import { Button } from "../ui/Button";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";
import { Input } from "../ui/Input";
import { splitLowercaseWords } from "../utils";

function ChatBlock({ chat, onDelete }) {
    const handleDelete = (event) => {
        event.preventDefault();
        onDelete?.(chat.chatId);
    };

    return (
        <Link
            className="flex relative group gap-6 px-4 py-3 border-b transition-colors duration-200 hover:bg-gray-100 "
            to={`/chats/${chat.chatId}`}
        >
            <CircleAvatar size={3} />
            <div className="font-medium">{chat.title}</div>

            <div title="Delete">
                <XIcon
                    className="h-4 w-4 absolute top-3 right-3 hidden group-hover:block cursor-pointer text-gray-600 hover:text-purple-500"
                    size="thin"
                    onClick={handleDelete}
                />
            </div>
        </Link>
    );
}

export function ChatListPage() {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [createChatModalIsOpen, setCreateChatModalIsOpen] = useState(false);

    useEffect(() => {
        getChats()
            .then((response) => {
                setChats(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChatCreated = (chat) => {
        setChats([...chats, chat]);
    };

    const handleDeleteChat = (chatId) => {
        deleteChat(chatId).then(() => {
            setChats(chats.filter((chat) => chat.chatId !== chatId));
        });
    };

    const searchWords = splitLowercaseWords(search);
    const matchingChats = chats.filter((chat) => {
        const titleWords = splitLowercaseWords(chat.title);
        return searchWords.every((word) =>
            titleWords.some((titleWord) => titleWord.includes(word))
        );
    });

    return (
        <Container>
            <LoadingContentWrapper
                isLoading={isLoading}
                loadingClassName="h-20"
            >
                <HeaderWithCount
                    className="flex"
                    title="Chats"
                    count={matchingChats.length}
                >
                    <Button
                        className="ml-auto"
                        size="thin"
                        onClick={() => setCreateChatModalIsOpen(true)}
                    >
                        Create
                    </Button>
                </HeaderWithCount>
                <HorizontalSeparator />

                <div className="flex flex-col py-4">
                    <div className="flex pb-4 px-4 border-b">
                        <Input
                            className="flex-grow"
                            value={search}
                            placeholder="Search"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    {matchingChats && (
                        <div className="flex flex-col">
                            {matchingChats.map((chat) => (
                                <ChatBlock
                                    key={chat.chatId}
                                    chat={chat}
                                    onDelete={handleDeleteChat}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <CreateChatModal
                    isOpen={createChatModalIsOpen}
                    onRequestClose={() => setCreateChatModalIsOpen(false)}
                    onChatCreated={handleChatCreated}
                />
            </LoadingContentWrapper>
        </Container>
    );
}
