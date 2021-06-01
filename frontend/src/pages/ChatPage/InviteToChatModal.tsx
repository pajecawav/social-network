import { useContext, useEffect, useState } from "react";
import { addChatUser, getFriends } from "../../api";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { ModalBase, ModalBaseProps } from "../../components/ModalBase";
import { UserCard } from "../../components/UserCard";
import { ChatContext } from "../../contexts/ChatContext";
import { User } from "../../types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { splitLowercaseWords } from "../../utils";

type InviteToChatModalProps = Omit<ModalBaseProps, "title">;

export const InviteToChatModal = (props: InviteToChatModalProps) => {
    const { chat, users } = useContext(ChatContext);
    const [search, setSearch] = useState("");

    const [alreadyInvitedIds, setAlreadyInvitedIds] = useState<number[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
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
    }, [chat]);

    const handleInviteUser = (userId: number) => {
        addChatUser(chat!.chatId, userId)
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
            (word: string) =>
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
};
