import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    getFriends,
    getUser,
    sendOrAcceptFriendRequest,
    unfriend,
} from "../api";
import { Avatar } from "../components/Avatar";
import { CircleAvatar } from "../components/CircleAvatar";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { SendMessageModal } from "../components/SendMessageModal";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserContext } from "../contexts/UserContext";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { buildSearchString } from "../utils";

const FRIEND_STATUS_TO_ACTION_TEXT = {
    friend: "Unfriend",
    not_friend: "Send request",
    request_sent: "Request sent",
    request_received: "Accept request",
};

function ImageBlock({ user, isMe, onFriendStatusChanged, className }) {
    const history = useHistory();
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);

    const navigateEditProfilePage = () => {
        history.push("/edit");
    };

    const handleFriendAction = () => {
        if (user.friendStatus === "friend") {
            unfriend(user.userId)
                .then(() => {
                    onFriendStatusChanged("not_friend");
                })
                .catch(console.error);
        } else {
            sendOrAcceptFriendRequest(user.userId)
                .then((response) => {
                    onFriendStatusChanged(response.data.friendStatus);
                })
                .catch(console.error);
        }
    };

    return (
        <Container className={clsx("flex flex-col gap-4 p-4", className)}>
            <div className="relative">
                <Avatar fileName={user.avatar?.fullName} />
                {isMe && !user.avatar && (
                    <Link
                        className="absolute text-primary-400 text-center w-full bottom-[7%] hover:underline "
                        to={{
                            pathname: "/edit",
                            search: buildSearchString({ section: "avatar" }),
                        }}
                    >
                        Upload a profile image
                    </Link>
                )}
            </div>
            {isMe && (
                <Button size="thin" onClick={navigateEditProfilePage}>
                    Edit
                </Button>
            )}

            {!isMe && (
                <>
                    <Button
                        size="thin"
                        onClick={() => setIsSendMessageModalOpen(true)}
                    >
                        Write message
                    </Button>

                    <Button
                        disabled={user.friendStatus === "request_sent"}
                        size="thin"
                        onClick={() => {
                            if (user.friendStatus === "friend") {
                                setIsUnfriendModalOpen(true);
                            } else {
                                handleFriendAction();
                            }
                        }}
                    >
                        {FRIEND_STATUS_TO_ACTION_TEXT[user.friendStatus]}
                    </Button>
                </>
            )}

            <SendMessageModal
                isOpen={isSendMessageModalOpen}
                toUserId={user.userId}
                onRequestClose={() => setIsSendMessageModalOpen(false)}
                onMessageSent={() => setIsSendMessageModalOpen(false)}
            />
            {!isMe && (
                <ConfirmationModal
                    isOpen={
                        user.friendStatus === "friend" && isUnfriendModalOpen
                    }
                    title="Unfriend user"
                    onConfirm={handleFriendAction}
                    onRequestClose={() => setIsUnfriendModalOpen(false)}
                >
                    <div>
                        Are you sure you want to unfriend{" "}
                        <span className="font-semibold text-secondary-500">
                            {user.firstName} {user.lastName}
                        </span>
                        ?
                    </div>
                </ConfirmationModal>
            )}
        </Container>
    );
}

export function UserProfilePage({ userId }) {
    const { user: currentUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null);
    const [friendsAmount, setFriendsAmount] = useState(null);

    const isMe = user && currentUser?.userId === user.userId;

    useTitle(user ? `${user.firstName} ${user.lastName}` : "Social Network", [
        user,
    ]);

    useEffect(() => {
        getUser(userId)
            .then((response) => setUser(response.data))
            .catch(console.error);
        getFriends({ userId, limit: 6, orderBy: "random" })
            .then((response) => {
                setFriends(response.data.friends);
                setFriendsAmount(response.data.totalMatches);
            })
            .catch(console.error);
    }, [userId]);

    const handleFriendStatusChanged = (newFriendStatus) => {
        setUser({ ...user, friendStatus: newFriendStatus });
    };

    return user === null ? (
        <LoadingPlaceholder className="h-full min-h-96" />
    ) : (
        <div className="flex flex-col flex-grow gap-4 md:flex-row">
            <div className="flex flex-col flex-shrink-0 order-2 w-full gap-4 md:order-1 md:w-60">
                <ImageBlock
                    user={user}
                    isMe={isMe}
                    onFriendStatusChanged={handleFriendStatusChanged}
                />
                <Container className="p-4">
                    <Link className="flex" to={`/friends?id=${user.userId}`}>
                        <div>Friends</div>
                        <div className="ml-2 text-primary-500">
                            {friendsAmount}
                        </div>
                    </Link>
                    {friends === null ? (
                        <LoadingPlaceholder className="w-full h-full min-h-40" />
                    ) : (
                        friends.length > 0 && (
                            <div className="grid grid-cols-3 mt-4 gap-y-2 gap-x-6">
                                {friends.map((friend) => (
                                    <Link
                                        className="flex flex-col items-center gap-2"
                                        to={`/users/${friend.userId}`}
                                        key={friend.userId}
                                    >
                                        <div className="flex-shrink-0 w-full">
                                            <CircleAvatar
                                                fileName={
                                                    friend.avatar?.fullName
                                                }
                                                isOnline={friend.isOnline}
                                            />
                                        </div>
                                        <div className="text-center hover:underline">
                                            {friend.firstName}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    )}
                </Container>
            </div>
            <div className="flex-grow order-1 md:order-1">
                <UserProfileInfo user={user} />
            </div>
        </div>
    );
}
