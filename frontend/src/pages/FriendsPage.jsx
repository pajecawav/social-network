import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getFriends, unfriend } from "../api";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { TabsHeader } from "../components/TabsHeader";
import { UserCard } from "../components/UserCard";
import { useSearchParams } from "../hooks/useSearchParams";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { buildSearchString, splitLowercaseWords } from "../utils";

const INITIAL_VISIBLE_AMOUNT = 10;

export function FriendsPage() {
    const { id: userId = null, section: selectedTab = "all" } =
        useSearchParams();
    const history = useHistory();
    const [query, setQuery] = useState("");
    const [friends, setFriends] = useState([]);
    const [visibleAmount, setVisibleAmount] = useState(INITIAL_VISIBLE_AMOUNT);
    const [isLoading, setIsLoading] = useState(true);
    const [unfriendingUser, setUnfriendingUser] = useState(null);

    useState(() => {
        getFriends({ userId })
            .then((response) => {
                setFriends(response.data.friends);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [userId]);

    const handleUnfriend = () => {
        unfriend(unfriendingUser.userId)
            .then(() => {
                setFriends(
                    friends.filter(
                        (friend) => friend.userId !== unfriendingUser.userId
                    )
                );
                setUnfriendingUser(null);
            })
            .catch(console.error);
    };

    const friendsOnlineCount = friends.filter(
        (friend) => friend.isOnline
    ).length;

    const queryWords = splitLowercaseWords(query);
    const matchingQueryFriends = query
        ? friends.filter((friend) =>
              queryWords.every(
                  (word) =>
                      friend.firstName.toLocaleLowerCase().includes(word) ||
                      friend.lastName.toLocaleLowerCase().includes(word)
              )
          )
        : friends;
    const matchingFriends =
        selectedTab === "all"
            ? matchingQueryFriends
            : matchingQueryFriends.filter((friend) => friend.isOnline);

    return (
        <Container className="flex flex-col">
            <TabsHeader
                tabs={[
                    { tab: "all", title: "All friends", count: friends.length },
                    {
                        tab: "online",
                        title: "Friends online",
                        count: friendsOnlineCount,
                    },
                ]}
                selectedTab={selectedTab}
                onTabSelected={(tab) =>
                    history.push({
                        pathname: "/friends",
                        search: buildSearchString({
                            id: userId,
                            section: tab,
                        }),
                    })
                }
            />

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
                                            className="pb-4 my-4 border-b border-primary-700"
                                            user={user}
                                        >
                                            <Button
                                                className="hidden h-full ml-auto sm:block"
                                                size="thin"
                                                onClick={() =>
                                                    setUnfriendingUser(user)
                                                }
                                            >
                                                Unfriend
                                            </Button>
                                        </UserCard>
                                    </React.Fragment>
                                ))}

                        {!matchingFriends.length && (
                            <div className="flex items-center justify-center h-20 m-auto my-6 text-primary-400">
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

            <ConfirmationModal
                isOpen={unfriendingUser !== null}
                title="Unfriend user"
                onConfirm={handleUnfriend}
                onRequestClose={() => setUnfriendingUser(null)}
            >
                {unfriendingUser && (
                    <div>
                        Are you sure you want to unfriend{" "}
                        <span className="font-semibold text-secondary-500">
                            {unfriendingUser.firstName}{" "}
                            {unfriendingUser.lastName}
                        </span>
                        ?
                    </div>
                )}
            </ConfirmationModal>
        </Container>
    );
}
