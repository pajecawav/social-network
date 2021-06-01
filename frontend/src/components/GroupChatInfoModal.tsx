import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { removeChatUser } from "../api";
import { ChatContext } from "../contexts/ChatContext";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { CircleAvatar } from "./CircleAvatar";
import { ModalBase, ModalBaseProps } from "./ModalBase";
import { UserCard } from "./UserCard";

type GroupChatInfoModalProps = Omit<ModalBaseProps, "title">;

export const GroupChatInfoModal = (props: GroupChatInfoModalProps) => {
    const { chat, users, removeUser } = useContext(ChatContext);
    const history = useHistory();
    const { user } = useContext(UserContext);

    if (chat?.chatType !== "group") {
        throw new Error(`Chat ${chat?.chatId} is not a group chat`);
    }

    const isAdmin = chat && user && chat.admin.userId === user.userId;

    const handleLeaveChat = () => {
        removeChatUser(chat!.chatId, user!.userId)
            .then(() => {
                history.replace("/chats");
            })
            .catch(console.error);
    };

    const handleRemoveUser = (userId: number) => {
        removeChatUser(chat!.chatId, userId)
            .then(() => removeUser(userId))
            .catch(console.error);
    };

    return (
        <ModalBase
            title="Information"
            style={{ content: { width: "24rem" } }}
            {...props}
        >
            <div className="gap-4">
                {/* header */}
                <div className="flex gap-4 pb-4 border-b-2 border-primary-700">
                    <div className="flex-shrink-0 w-16">
                        <CircleAvatar />
                    </div>
                    <div>
                        <div className="font-medium">{chat!.title}</div>
                        <div className="text-primary-500">
                            {users!.length} members
                        </div>
                    </div>
                </div>

                {/* users list */}
                <div className="my-4">
                    <div className="mb-2">Users:</div>
                    <div className="flex flex-col gap-3 -mr-3 overflow-y-scroll max-h-80">
                        {users!.map((user) => (
                            <UserCard
                                avatarClassName="w-12"
                                user={user}
                                key={user.userId}
                            >
                                {user.userId === chat.admin.userId ? (
                                    <div className="self-center ml-auto mr-2 text-primary-500">
                                        Admin
                                    </div>
                                ) : (
                                    isAdmin && (
                                        <Button
                                            className="self-center ml-auto mr-2"
                                            size="thin"
                                            onClick={() =>
                                                handleRemoveUser(user.userId)
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
            </div>
        </ModalBase>
    );
};
