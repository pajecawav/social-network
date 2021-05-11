import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChats } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { CreateChatModal } from "../components/CreateChatModal";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { ChatsContext } from "../contexts/ChatsContext";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { formatDateOrTime, getChatTitle, splitLowercaseWords } from "../utils";

function ChatBlock({ chat }) {
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
                        <div className="text-sm text-primary-500">
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
                <div className="absolute top-3 right-4 text-sm text-primary-500">
                    {formatDateOrTime(lastMessage.timeSent)}
                </div>
            )}
            {/* <div title="Delete"> */}
            {/*     <XIcon */}
            {/*         className="h-4 w-4 absolute top-3 right-3 hidden group-hover:block cursor-pointer text-primary-400 hover:text-primary-300 transition-colors duration-200" */}
            {/*         size="thin" */}
            {/*         onClick={handleDelete} */}
            {/*     /> */}
            {/* </div> */}
        </Link>
    );
}

export function ChatListPage() {
    const [chats, setChats] = useState([]);
    const { subscribeToChat, unsubscribeFromChat } = useContext(ChatsContext);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [createChatModalIsOpen, setCreateChatModalIsOpen] = useState(false);

    useTitle("Chats");

    useEffect(() => {
        getChats()
            .then((response) => {
                setChats(response.data);
                setIsLoading(false);
            })
            .catch(console.error);

        const handleNewMessage = (message, chatId) => {
            setChats((currentChats) =>
                currentChats.map((chat) =>
                    chat.chatId === chatId
                        ? { ...chat, lastMessage: message }
                        : chat
                )
            );
        };
        subscribeToChat("*", handleNewMessage);
        return () => unsubscribeFromChat(handleNewMessage);
    }, [subscribeToChat, unsubscribeFromChat]);

    const handleChatCreated = (chat) => {
        setChats([chat, ...chats]);
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
                                    <ChatBlock key={chat.chatId} chat={chat} />
                                ))}
                            </div>
                        )}
                    </div>

                    <CreateChatModal
                        isOpen={createChatModalIsOpen}
                        onRequestClose={() => setCreateChatModalIsOpen(false)}
                        onChatCreated={handleChatCreated}
                    />
                </>
            )}
        </Container>
    );
}
