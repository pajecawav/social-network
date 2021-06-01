import clsx from "clsx";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getUsers } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { UserCard } from "../components/UserCard";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useSearchParams } from "../hooks/useSearchParams";
import { useTitle } from "../hooks/useTitle";
import { User } from "../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { buildSearchString } from "../utils";

export const UsersSearchPage = () => {
    const history = useHistory();
    const { query: queryParam = null } = useSearchParams();

    const [query, setQuery] = useState(queryParam);
    const [search, setSearch] = useState(query);
    const [loadOnScroll, setLoadOnScroll] = useState(true);

    const [users, setUsers] = useState<User[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [totalMatches, setTotalMatches] = useState<number | null>(null);

    const isSmallScreen = useIsSmallScreen();

    useTitle(`Search results` + (search ? ` for ${search}` : ""));

    useEffect(() => {
        setUsers([]);
        setLoadOnScroll(true);
        setNextCursor(null);
    }, [search]);

    useEffect(() => {
        setSearch(queryParam);
        setQuery(queryParam);
        setNextCursor(null);
    }, [queryParam]);

    const handleSearch = () => {
        setSearch(query);
        history.push({
            pathname: "/users/search",
            search: buildSearchString({ query }),
        });
    };

    const fetchMoreUsers = () => {
        getUsers({ query: search, cursor: nextCursor }).then((response) => {
            setUsers([...users, ...response.data.users]);
            setNextCursor(response.data.nextCursor);
            setTotalMatches(response.data.totalMatches);
            setLoadOnScroll(Boolean(response.data.nextCursor));
        });
    };

    const noResults = !(loadOnScroll || users.length);

    return (
        <Container className="flex flex-col">
            <HeaderWithCount title="People" count={totalMatches} />

            <div className="flex gap-4 p-4 border-b-2 border-primary-700">
                <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Search"
                    value={query || ""}
                    onChange={setQuery}
                    onEnterPressed={handleSearch}
                />
                {!isSmallScreen && (
                    <Button onClick={handleSearch}>Search</Button>
                )}
            </div>

            <div className="mx-6">
                {users.length > 0 &&
                    users.map((user) => (
                        <UserCard
                            className="pb-4 my-4 border-b border-primary-700"
                            key={user.userId}
                            user={user}
                        />
                    ))}

                {loadOnScroll && (
                    <Waypoint onEnter={fetchMoreUsers} bottomOffset={-200}>
                        <div
                            className={clsx(
                                "flex mt-6 mb-2",
                                users.length === 0 && "h-20"
                            )}
                        >
                            <Spinner className="m-auto" />
                        </div>
                    </Waypoint>
                )}

                {noResults && (
                    <div className="flex items-center justify-center h-24 text-primary-400">
                        Your search returned no results
                    </div>
                )}
            </div>
        </Container>
    );
};
