import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getFriends, unfriend } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { UserCard } from "../components/UserCard";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { splitLowercaseWords } from "../utils";

const INITIAL_VISIBLE_AMOUNT = 10;

export function FriendsPage() {
    const location = useLocation();
    const userId = new URLSearchParams(location.search).get("id") || null;
    const [query, setQuery] = useState("");
    const [friends, setFriends] = useState([]);
    const [visibleAmount, setVisibleAmount] = useState(INITIAL_VISIBLE_AMOUNT);
    const [isLoading, setIsLoading] = useState(true);

    useTitle(`Friends – ${friends.length} friends`);

    useState(() => {
        getFriends({ userId })
            .then((response) => {
                setFriends(response.data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [userId]);

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

            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <>
                    <div className="flex border-b-2 border-primary-700">
                        <Input
                            className="flex-grow py-2 m-4"
                            type="text"
                            placeholder="Search friends"
                            value={query || ""}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setVisibleAmount(INITIAL_VISIBLE_AMOUNT);
                            }}
                        />
                    </div>

                    <div className="mx-6">
                        {matchingFriends.length > 0 &&
                            matchingFriends
                                .slice(0, visibleAmount)
                                .map((user) => (
                                    <React.Fragment key={user.userId}>
                                        <UserCard
                                            className="pb-4 border-b border-primary-700"
                                            user={user}
                                        >
                                            <Button
                                                className="ml-auto h-full"
                                                size="thin"
                                                onClick={() =>
                                                    handleUnfriend(user)
                                                }
                                            >
                                                Unfriend
                                            </Button>
                                        </UserCard>
                                    </React.Fragment>
                                ))}

                        {!matchingFriends.length && (
                            <div className="flex justify-center items-center m-auto my-6 h-20 text-primary-400">
                                No friends were found
                            </div>
                        )}

                        {visibleAmount < matchingFriends.length && (
                            <Waypoint
                                onEnter={() =>
                                    setVisibleAmount(
                                        visibleAmount + INITIAL_VISIBLE_AMOUNT
                                    )
                                }
                                bottomOffset={-200}
                            />
                        )}
                    </div>
                </>
            )}
        </Container>
    );
}
