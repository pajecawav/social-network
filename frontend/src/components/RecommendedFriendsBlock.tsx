import clsx from "clsx";
import { useEffect, useState } from "react";
import { getRecommendedFriends } from "../api";
import { User } from "../types";
import { Container } from "./Container";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { UserCard } from "./UserCard";

type RecommendedFriendsBlockProps = {
    className?: string;
};

export const RecommendedFriendsBlock = ({
    className,
}: RecommendedFriendsBlockProps) => {
    const [recommendedFriends, setRecommendedFriends] =
        useState<User[] | null>(null);

    useEffect(() => {
        getRecommendedFriends({ limit: 4 })
            .then((response) => setRecommendedFriends(response.data))
            .catch(console.error);
    }, []);

    if (recommendedFriends && recommendedFriends.length === 0) {
        return null;
    }

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
                                key={user.userId}
                            />
                        ))}
                    </div>
                </>
            )}
        </Container>
    );
};
