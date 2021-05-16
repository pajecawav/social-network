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
import {
    chatActionToText,
    formatDateOrTime,
    getChatTitle,
    splitLowercaseWords,
} from "../utils";

function ChatBlock({ chat }) {
    const lastMessage = chat.lastMessage;

    return (
        <Link
            className="flex relative group gap-4 px-4 py-3 border-b border-primary-700 transition-colors duration-200 hover:bg-primary-700 "
            to={`/chats/${chat.chatId}`}
        >
            <div className="flex-shrink-0 w-14">
                <CircleAvatar />
            </div>

            <div className="min-w-0">
                <div className="mb-2 text-primary-300 font-medium">
                    {getChatTitle(chat)}
                </div>
                {lastMessage &&
                    (lastMessage.action ? (
                        // TODO render message based on action type
                        <div className="text-sm text-primary-500">
                            {chatActionToText(
                                lastMessage.user,
                                lastMessage.action
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <div className="flex-shrink-0 w-7">
                                <CircleAvatar />
                            </div>
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
    const {
        subscribeToChat,
        unsubscribeFromChat,
        subscribeToNewChats,
        unsubscribeFromNewChats,
    } = useContext(ChatsContext);
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
            setChats((currentChats_) => {
                const currentChats = [...currentChats_];
                const index = currentChats.findIndex(
                    (chat) => chat.chatId === chatId
                );
                if (index === -1) return currentChats;
                const chat = currentChats.splice(index, 1)[0];
                return [{ ...chat, lastMessage: message }, ...currentChats];
            });
        };
        subscribeToChat("*", handleNewMessage);

        return () => unsubscribeFromChat("*", handleNewMessage);
    }, [subscribeToChat, unsubscribeFromChat]);

    useEffect(() => {
        const handleNewChat = (chat) => {
            setChats((currentChats) => [chat, ...currentChats]);
        };
        subscribeToNewChats(handleNewChat);
        return () => unsubscribeFromNewChats(handleNewChat);
    }, [subscribeToNewChats, unsubscribeFromNewChats]);

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
