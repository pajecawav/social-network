import clsx from "clsx";
import { useEffect, useState } from "react";
import { getRecommendedFriends } from "../api";
import { Container } from "./Container";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { UserCard } from "./UserCard";

export function RecommendedFriendsBlock({ className }) {
    const [recommendedFriends, setRecommendedFriends] = useState(null);

    useEffect(() => {
        getRecommendedFriends({ limit: 4 })
            .then((response) => setRecommendedFriends(response.data))
            .catch(console.error);
    }, []);

    return (
        <Container className={clsx("py-3 px-2", className)}>
            {recommendedFriends === null ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <h2 className="text-sm">People you may know</h2>
                    <div className="flex flex-col gap-2 mt-4">
                        {recommendedFriends.map((user) => (
                            <UserCard
                                className="text-sm"
                                avatarClassName="w-10 -mr-2"
                                user={user}
                            />
                        ))}
                    </div>
                </>
            )}
        </Container>
    );
}
