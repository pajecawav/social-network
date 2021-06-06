import { useContext, useEffect, useState } from "react";
import { getFriends, getUser } from "../../api";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { UserContext } from "../../contexts/UserContext";
import { useTitle } from "../../hooks/useTitle";
import { FriendStatus, User } from "../../types";
import { FriendsBlock } from "./FriendsBlock";
import { ImageBlock } from "./ImageBlock";
import { UserProfileInfo } from "./UserProfileInfo";

export const UserProfilePage = ({ userId }: { userId: number }) => {
    const { user: currentUser } = useContext(UserContext);
    const [user, setUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<User[] | null>(null);
    const [friendsAmount, setFriendsAmount] = useState<number | null>(null);

    const isMe = user !== null && currentUser?.userId === user.userId;

    useTitle(
        user === null ? "Social Network" : `${user.firstName} ${user.lastName}`
    );

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

    const handleFriendStatusChanged = (newFriendStatus: FriendStatus) => {
        setUser({ ...user!, friendStatus: newFriendStatus });
    };

    return user === null ? (
        <LoadingPlaceholder />
    ) : (
        <div className="flex flex-col flex-grow gap-4 md:flex-row">
            <div className="flex flex-col flex-shrink-0 order-2 w-full gap-4 md:order-1 md:w-60">
                <ImageBlock
                    user={user}
                    isMe={isMe}
                    onFriendStatusChanged={handleFriendStatusChanged}
                />
                <FriendsBlock
                    randomFriends={friends}
                    friendsAmount={friendsAmount}
                    userId={user.userId}
                />
            </div>
            <div className="flex-grow order-1 md:order-1">
                <UserProfileInfo user={user} />
            </div>
        </div>
    );
};
