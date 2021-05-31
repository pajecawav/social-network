import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriends, getUser } from "../../api";
import { CircleAvatar } from "../../components/CircleAvatar";
import { Container } from "../../components/Container";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { UserContext } from "../../contexts/UserContext";
import { useTitle } from "../../hooks/useTitle";
import { ImageBlock } from "./ImageBlock";
import { UserProfileInfo } from "./UserProfileInfo";

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
                                                    friend.avatar?.filename
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
