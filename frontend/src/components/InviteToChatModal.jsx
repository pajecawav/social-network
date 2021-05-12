import { useEffect, useState } from "react";
import { addChatUser, getChatUsers, getFriends } from "../api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { splitLowercaseWords } from "../utils";
import { ModalBase } from "./../ui/ModalBase";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { UserCard } from "./UserCard";

export function InviteToChatModal({ chat, ...props }) {
    const [search, setSearch] = useState("");

    const [alreadyInvitedIds, setAlreadyInvitedIds] = useState([]);
    const [isAlreadyInvitedLoading, setIsAlreadyInvitedLoading] = useState(
        true
    );
    const [friends, setFriends] = useState([]);
    const [isFriendsLoading, setIsFriendsLoading] = useState(true);

    useEffect(() => {
        getChatUsers(chat.chatId)
            .then((response) => {
                setAlreadyInvitedIds(response.data.map((user) => user.userId));
                setIsAlreadyInvitedLoading(false);
            })
            .catch(console.error);
    }, [chat.chatId]);

    useEffect(() => {
        getFriends(chat.chatId)
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
    const isLoading = isAlreadyInvitedLoading && isFriendsLoading;

    const searchWords = splitLowercaseWords(search);
    const matchingUsers = canInviteUsers.filter((user) =>
        searchWords.every(
            (word) =>
                user.firstName.toLocaleLowerCase().includes(word) ||
                user.lastName.toLocaleLowerCase().includes(word)
        )
    );

    return (
        <ModalBase title="Invite" {...props}>
            <div className="w-80">
                {isLoading ? (
                    <LoadingPlaceholder />
                ) : (
                    <div className="flex flex-col gap-4">
                        <Input
                            className="w-auto"
                            placeholder="Search"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <div className="max-h-80 flex flex-col -mr-4 gap-3 overflow-y-scroll">
                            {matchingUsers.map((user) => (
                                <UserCard
                                    avatarClassName="w-12"
                                    user={user}
                                    key={user.userId}
                                >
                                    <Button
                                        className="ml-auto mr-2 self-center"
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
