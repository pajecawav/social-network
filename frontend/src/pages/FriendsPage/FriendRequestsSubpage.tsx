import { useContext, useEffect, useState } from "react";
import {
    getFriendRequests,
    sendOrAcceptFriendRequest,
    unfriend,
} from "../../api";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { UserCard } from "../../components/UserCard";
import { UserContext } from "../../contexts/UserContext";
import { useSearchParams } from "../../hooks/useSearchParams";
import { User } from "../../types";
import { Button } from "../../ui/Button";

export const FriendRequestsSubpage = () => {
    const { user } = useContext(UserContext);
    const { section = "requests_incoming" } = useSearchParams();
    const [requestUsers, setRequestUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isIncoming = section === "requests_incoming";

    useEffect(() => {
        setIsLoading(true);
        getFriendRequests({ incoming: isIncoming })
            .then((response) => {
                setRequestUsers(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [user, isIncoming]);

    const handleAcceptRequest = (user: User) => {
        sendOrAcceptFriendRequest(user.userId).then(() =>
            setRequestUsers(
                requestUsers.filter((u) => u.userId !== user.userId)
            )
        );
    };

    const handleDeleteRequest = (user: User) => {
        unfriend(user.userId).then(() =>
            setRequestUsers(
                requestUsers.filter((u) => u.userId !== user.userId)
            )
        );
    };

    return isLoading ? (
        <LoadingPlaceholder />
    ) : (
        <div className="mx-6">
            {requestUsers.length > 0 ? (
                requestUsers.map((user) => (
                    <div key={user.userId}>
                        <UserCard
                            className="flex gap-4 pb-4 my-4 border-b border-primary-700"
                            user={user}
                        >
                            <div className="flex flex-col self-start gap-4 ml-auto sm:flex-row">
                                {isIncoming && (
                                    <Button
                                        size="thin"
                                        onClick={() =>
                                            handleAcceptRequest(user)
                                        }
                                    >
                                        Accept
                                    </Button>
                                )}
                                <Button
                                    size="thin"
                                    secondary={isIncoming}
                                    onClick={() => handleDeleteRequest(user)}
                                >
                                    {isIncoming ? "Decline" : "Cancel"}
                                </Button>
                            </div>
                        </UserCard>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center h-20 m-auto my-6 text-primary-400">
                    No {isIncoming ? "incoming" : "sent"} friend requests
                </div>
            )}
        </div>
    );
};
