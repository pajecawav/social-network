import clsx from "clsx";
import React, { useState } from "react";
import { getFriends, unfriend } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingContentWrapper } from "../components/LoadingContentWrapper";
import { UserCard } from "../components/UserCard";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";
import { Input } from "../ui/Input";
import { splitLowercaseWords } from "../utils";

export function FriendsPage() {
    const [query, setQuery] = useState("");
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useTitle(`Friends – ${friends.length} friends`);

    useState(() => {
        getFriends()
            .then((response) => {
                setFriends(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    });

    const handleUnfriend = ({ userId }) => {
        unfriend(userId)
            .then(() => {
                setFriends(
                    friends.filter((friend) => friend.userId !== userId)
                );
            })
            .catch(console.error);
    };

    const queryWords = splitLowercaseWords(query);
    const matchingFriends = query
        ? friends.filter((friend) =>
              queryWords.every(
                  (word) =>
                      friend.firstName.toLocaleLowerCase().includes(word) ||
                      friend.lastName.toLocaleLowerCase().includes(word)
              )
          )
        : friends;

    return (
        <Container className="flex flex-col">
            <HeaderWithCount title="Friends" count={matchingFriends.length} />
            <HorizontalSeparator />

            <LoadingContentWrapper
                isLoading={isLoading}
                loadingClassName="h-20"
            >
                <Input
                    className="flex-grow py-2 m-4"
                    type="text"
                    placeholder="Search friends"
                    value={query || ""}
                    onChange={(event) => setQuery(event.target.value)}
                />

                <HorizontalSeparator />

                <div
                    className={clsx(
                        "mx-6",
                        matchingFriends.length !== 0 && "mb-6"
                    )}
                >
                    {matchingFriends.length > 0 &&
                        matchingFriends.map((user) => (
                            <React.Fragment key={user.userId}>
                                <UserCard user={user}>
                                    <Button
                                        className="ml-auto h-full"
                                        size="thin"
                                        onClick={() => handleUnfriend(user)}
                                    >
                                        Unfriend
                                    </Button>
                                </UserCard>
                                <HorizontalSeparator />
                            </React.Fragment>
                        ))}

                    {!matchingFriends.length && (
                        <div className="flex justify-center items-center m-auto my-6 h-20 text-gray-400">
                            No friends were found
                        </div>
                    )}
                </div>
            </LoadingContentWrapper>
        </Container>
    );
}
