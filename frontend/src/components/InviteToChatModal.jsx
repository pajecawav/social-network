import { useContext, useEffect, useState } from "react";
import { addChatUser, getFriends } from "../api";
import { ChatContext } from "../contexts/ChatContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { splitLowercaseWords } from "../utils";
import { ModalBase } from "./../ui/ModalBase";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { UserCard } from "./UserCard";

export function InviteToChatModal({ ...props }) {
    const { chat, users } = useContext(ChatContext);
    const [search, setSearch] = useState("");

    const [alreadyInvitedIds, setAlreadyInvitedIds] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isFriendsLoading, setIsFriendsLoading] = useState(true);

    useEffect(() => {
        setAlreadyInvitedIds(users.map((user) => user.userId));
    }, [users]);

    useEffect(() => {
        getFriends()
            .then((response) => {
                setFriends(response.data.friends);
                setIsFriendsLoading(false);
            })
            .catch(console.error);
    }, [chat.chatId]);

    const handleInviteUser = (userId) => {
        addChatUser(chat.chatId, userId)
            .then(() => {
                setFriends(
                    friends.filter((friend) => friend.userId !== userId)
                );
                setAlreadyInvitedIds([...alreadyInvitedIds, userId]);
            })
            .catch(console.error);
    };

    const canInviteUsers = friends.filter(
        (friend) => !alreadyInvitedIds.includes(friend.userId)
    );
    const isLoading = isFriendsLoading;

    const searchWords = splitLowercaseWords(search);
    const matchingUsers = canInviteUsers.filter((user) =>
        searchWords.every(
            (word) =>
                user.firstName.toLocaleLowerCase().includes(word) ||
                user.lastName.toLocaleLowerCase().includes(word)
        )
    );

    return (
        <ModalBase
            title="Invite"
            style={{ content: { width: "24rem" } }}
            {...props}
        >
            <div>
                {isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <div className="flex flex-col gap-4">
                        <Input
                            className="w-auto"
                            placeholder="Search"
                            onChange={setSearch}
                        />
                        <div className="flex flex-col gap-3 -mr-3 overflow-y-scroll max-h-80">
                            {matchingUsers.map((user) => (
                                <UserCard
                                    avatarClassName="w-12"
                                    user={user}
                                    key={user.userId}
                                >
                                    <Button
                                        className="self-center ml-auto mr-2"
                                        size="thin"
                                        onClick={() =>
                                            handleInviteUser(user.userId)
                                        }
                                    >
                                        Invite
                                    </Button>
                                </UserCard>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ModalBase>
    );
}
