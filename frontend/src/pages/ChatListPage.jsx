import { PlusIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChats } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { CreateChatModal } from "../components/CreateChatModal";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { ChatsContext } from "../contexts/ChatsContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
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
    const seenLastMessage =
        chat.lastSeenMessageId !== null &&
        lastMessage.messageId === chat.lastSeenMessageId;

    return (
        <Link
            className="relative flex gap-4 px-4 py-3 transition-colors duration-200 border-b group border-primary-700 hover:bg-primary-700 hover:bg-opacity-50"
            to={`/chats/${chat.chatId}`}
        >
            <div className="flex-shrink-0 w-14">
                <CircleAvatar
                    isOnline={chat.chatType === "direct" && chat.peer.isOnline}
                    fileName={chat.peer?.avatar?.filename}
                />
            </div>

            <div className="w-full min-w-0">
                <div className="mb-2 font-medium text-primary-300">
                    {getChatTitle(chat)}
                </div>
                {lastMessage &&
                    (lastMessage.action ? ( // TODO: render message based on action type
                        <div
                            className={clsx(
                                "text-sm text-primary-500 py-1 px-2 rounded-sm",
                                !seenLastMessage && "bg-primary-700"
                            )}
                        >
                            {chatActionToText(
                                lastMessage.user,
                                lastMessage.action
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-7">
                                <CircleAvatar
                                    fileName={lastMessage.user.avatar?.filename}
                                />
                            </div>
                            <div
                                className={clsx(
                                    "w-full h-7 py-1 px-2 rounded-sm overflow-hidden text-sm text-primary-300 whitespace-nowrap overflow-ellipsis",
                                    !seenLastMessage && "bg-primary-700"
                                )}
                            >
                                {lastMessage.text}
                            </div>
                        </div>
                    ))}
            </div>

            {lastMessage && (
                <div className="absolute text-sm top-3 right-4 text-primary-500">
                    {formatDateOrTime(lastMessage.timeSent)}
                </div>
            )}
            {/* <div title="Delete"> */}
            {/*     <XIcon */}
            {/*         className="absolute hidden w-4 h-4 transition-colors duration-200 cursor-pointer top-3 right-3 group-hover:block text-primary-400 hover:text-primary-300" */}
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
    const isSmallScreen = useIsSmallScreen();

    useTitle("Chats");

    useEffect(() => {
        getChats()
            .then((response) => {
                setChats(response.data);
                setIsLoading(false);
            })
            .catch(console.error);

        const handleNewMessage = (_, { message, chatId }) => {
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
                        {isSmallScreen ? (
                            <button
                                className="w-8 ml-auto text-secondary-600"
                                onClick={() => setCreateChatModalIsOpen(true)}
                            >
                                <PlusIcon />
                            </button>
                        ) : (
                            <Button
                                className="ml-auto"
                                size="thin"
                                onClick={() => setCreateChatModalIsOpen(true)}
                            >
                                Create
                            </Button>
                        )}
                    </HeaderWithCount>

                    <div className="flex flex-col py-4">
                        <div className="flex px-4 pb-4 border-b border-primary-700">
                            <Input
                                className="flex-grow"
                                value={search}
                                placeholder="Search"
                                onChange={setSearch}
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
