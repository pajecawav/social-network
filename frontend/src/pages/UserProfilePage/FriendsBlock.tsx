import { Link } from "react-router-dom";
import { CircleAvatar } from "../../components/CircleAvatar";
import { Container } from "../../components/Container";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { User } from "../../types";

type FriendsBlockProps = {
    userId: number;
    randomFriends: User[] | null;
    friendsAmount: number | null;
};

export const FriendsBlock = ({
    userId,
    randomFriends,
    friendsAmount,
}: FriendsBlockProps) => (
    <Container className="p-4">
        <Link className="flex" to={`/friends?id=${userId}`}>
            <div>Friends</div>
            <div className="ml-2 text-primary-500">{friendsAmount}</div>
        </Link>
        {randomFriends === null ? (
            <LoadingPlaceholder className="w-full h-full min-h-40" />
        ) : (
            randomFriends.length > 0 && (
                <div className="grid grid-cols-3 mt-4 sm:grid-cols-6 md:grid-cols-3 gap-y-2 gap-x-6">
                    {randomFriends.map((friend) => (
                        <Link
                            className="flex flex-col items-center gap-2"
                            to={`/users/${friend.userId}`}
                            key={friend.userId}
                        >
                            <div className="flex-shrink-0 w-full">
                                <CircleAvatar
                                    fileName={friend.avatar?.filename}
                                    identiconSeed={friend.userId}
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
);
