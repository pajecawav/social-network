import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { addFriend, getFriends, getUser, unfriend } from "../api";
import { Avatar } from "../components/Avatar";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { SendMessageModal } from "../components/SendMessageModal";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserContext } from "../contexts/UserContext";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";

function ImageBlock({ user, isMe, className }) {
    const history = useHistory();
    const [isFriend, setIsFriend] = useState(user?.isFriend === true);
    const [sendMessageModalIsOpen, setSendMessageModalIsOpen] = useState(false);

    const navigateEditProfilePage = () => {
        history.push("/edit");
    };

    const handleToggleFriend = (event) => {
        event.preventDefault();

        if (isFriend) {
            unfriend(user.userId)
                .then(() => {
                    setIsFriend(false);
                })
                .catch(console.error);
        } else {
            addFriend(user.userId)
                .then(() => {
                    setIsFriend(true);
                })
                .catch(console.error);
        }
    };

    return (
        <Container className={clsx("flex flex-col gap-4 p-4", className)}>
            <div className="relative">
                <Avatar />
                {/* TODO: hide controls if user already has profile picture */}
                <div className="absolute text-primary-400 text-center w-full bottom-[7%]">
                    Upload a profile image
                </div>
                <input
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(event) =>
                        console.log("Selected", event.target.value)
                    }
                />
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
                        onClick={() => setSendMessageModalIsOpen(true)}
                    >
                        Write message
                    </Button>

                    <Button size="thin" onClick={handleToggleFriend}>
                        {isFriend === true ? "Unfriend" : "Add friend"}
                    </Button>
                </>
            )}

            <SendMessageModal
                isOpen={sendMessageModalIsOpen}
                toUserId={user.userId}
                onRequestClose={() => setSendMessageModalIsOpen(false)}
                onMessageSent={() => setSendMessageModalIsOpen(false)}
            />
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

    return user === null ? (
        <LoadingPlaceholder className="h-full min-h-96" />
    ) : (
        <div className="flex flex-col flex-grow gap-4 md:flex-row">
            <div className="flex flex-col flex-shrink-0 order-2 w-full gap-4 md:order-1 md:w-60">
                <ImageBlock user={user} isMe={isMe} />
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
