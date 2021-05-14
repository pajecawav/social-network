import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getChatUsers, removeChatUser } from "../api";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { ModalBase } from "./../ui/ModalBase";
import { CircleAvatar } from "./CircleAvatar";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { UserCard } from "./UserCard";

export function GroupChatInfoModal({ chat, ...props }) {
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = chat.admin.userId === user.userId;

    useEffect(() => {
        getChatUsers(chat.chatId)
            .then((response) => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [chat.chatId]);

    const handleLeaveChat = (event) => {
        event.preventDefault();
        removeChatUser(chat.chatId, user.userId)
            .then(() => {
                history.replace("/chats");
            })
            .catch(console.error);
    };

    const handleRemoveUser = (userId) => {
        removeChatUser(chat.chatId, userId)
            .then(() => {
                setUsers(users.filter((user) => user.userId !== userId));
            })
            .catch(console.error);
    };

    return (
        <ModalBase
            title="Information"
            style={{ content: { width: "24rem" } }}
            {...props}
        >
            <div className="gap-4">
                {isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <>
                        {/* header */}
                        <div className="flex gap-4 pb-4 border-b-2 border-primary-700">
                            <div className="flex-shrink-0 w-16">
                                <CircleAvatar />
                            </div>
                            <div>
                                <div className="font-medium">{chat.title}</div>
                                <div className="text-primary-500">
                                    {users.length} members
                                </div>
                            </div>
                        </div>

                        {/* users list */}
                        <div className="my-4">
                            <div className="mb-2">Users:</div>
                            <div className="max-h-80 flex flex-col -mr-4 gap-3 overflow-y-scroll">
                                {users.map((user) => (
                                    <UserCard
                                        avatarClassName="w-12"
                                        user={user}
                                        key={user.userId}
                                    >
                                        {user.userId === chat.admin.userId ? (
                                            <div className="ml-auto mr-2 self-center text-primary-500">
                                                Admin
                                            </div>
                                        ) : (
                                            isAdmin && (
                                                <Button
                                                    className="ml-auto mr-2 self-center"
                                                    size="thin"
                                                    onClick={() =>
                                                        handleRemoveUser(
                                                            user.userId
                                                        )
                                                    }
                                                >
                                                    Kick
                                                </Button>
                                            )
                                        )}
                                    </UserCard>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleLeaveChat}>
                            Leave chat
                        </Button>
                    </>
                )}
            </div>
        </ModalBase>
    );
}
