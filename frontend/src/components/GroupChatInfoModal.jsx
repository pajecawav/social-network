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

    return (
        <ModalBase title="Information" {...props}>
            <div className="w-72 gap-4">
                {isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <>
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

                        <div className="my-4">
                            <div className="mb-2">Users:</div>
                            <div className="h-60 flex flex-col -mr-4 gap-4 overflow-y-scroll">
                                {users.map((user) => (
                                    <div className="flex" key={user.userId}>
                                        <UserCard
                                            avatarClassName="w-8"
                                            user={user}
                                        />
                                        {user.userId === chat.admin.userId && (
                                            <div className="ml-auto mr-1 text-primary-500">
                                                Admin
                                            </div>
                                        )}
                                    </div>
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
