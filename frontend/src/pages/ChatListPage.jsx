import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteChat, getChats } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Container } from "../components/Container";
import { CreateChatModal } from "../components/CreateChatModal";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { formatDateOrTime, getChatTitle, splitLowercaseWords } from "../utils";

function ChatBlock({ chat, onDelete }) {
    const handleDelete = (event) => {
        event.preventDefault();
        onDelete?.(chat.chatId);
    };

    const lastMessage = chat.lastMessage;

    return (
        <Link
            className="flex relative group gap-6 px-4 py-3 border-b border-primary-700 transition-colors duration-200 hover:bg-primary-700 "
            to={`/chats/${chat.chatId}`}
        >
            <CircleAvatar size={3} />

            <div className="min-w-0">
                <div className="mb-2 text-primary-300 font-medium">
                    {getChatTitle(chat)}
                </div>
                {lastMessage &&
                    (lastMessage.action ? (
                        // TODO render message based on action type
                        <div className="text-primary-500">
                            {`${lastMessage.user.firstName} ${lastMessage.user.lastName} created chat`}
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <CircleAvatar size={1.5} />
                            <div className="h-6 text-sm text-primary-300 whitespace-nowrap overflow-ellipsis overflow-hidden">
                                {lastMessage.text}
                            </div>
                        </div>
                    ))}
            </div>

            {lastMessage && (
                <div className="absolute top-3 right-10 text-sm text-primary-500">
                    {formatDateOrTime(lastMessage.timeSent)}
                </div>
            )}
            <div title="Delete">
                <XIcon
                    className="h-4 w-4 absolute top-3 right-3 hidden group-hover:block cursor-pointer text-primary-400 hover:text-primary-300 transition-colors duration-200"
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
    const [deletingChatId, setDeletingChatId] = useState(null);

    useTitle("Chats");

    useEffect(() => {
        getChats()
            .then((response) => {
                setChats(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChatCreated = (chat) => {
        setChats([chat, ...chats]);
    };

    const handleConfirmDeleteChat = (chatId) => {
        setDeletingChatId(chatId);
    };

    const handleDeleteChat = () => {
        deleteChat(deletingChatId).then(() => {
            setChats(chats.filter((chat) => chat.chatId !== deletingChatId));
            setDeletingChatId(null);
        });
    };

    const searchWords = splitLowercaseWords(search);
    const matchingChats = chats.filter((chat) => {
        const titleWords = splitLowercaseWords(getChatTitle(chat));
        return searchWords.every((word) =>
            titleWords.some((titleWord) => titleWord.includes(word))
        );
    });

    return (
        <Container>
            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
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

                    <div className="flex flex-col py-4">
                        <div className="flex pb-4 px-4 border-b border-primary-700">
                            <Input
                                className="flex-grow"
                                value={search}
                                placeholder="Search"
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        {matchingChats && (
                            <div className="flex flex-col">
                                {matchingChats.map((chat) => (
                                    <ChatBlock
                                        key={chat.chatId}
                                        chat={chat}
                                        onDelete={handleConfirmDeleteChat}
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

                    <ConfirmationModal
                        isOpen={deletingChatId !== null}
                        title="Delete chat"
                        confirmText="Delete"
                        onRequestClose={() => setDeletingChatId(null)}
                        onConfirm={handleDeleteChat}
                    >
                        <div className="flex flex-col gap-2">
                            <p>
                                Are you sure you want to delete the{" "}
                                <b className="font-semibold">entire</b> chat?
                            </p>
                            <p>
                                This <b className="font-semibold">can't</b> be
                                undone.
                            </p>
                        </div>
                    </ConfirmationModal>
                </>
            )}
        </Container>
    );
}
