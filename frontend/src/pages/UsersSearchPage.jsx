import clsx from "clsx";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getUsers } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { UserCard } from "../components/UserCard";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";

export function UsersSearchPage() {
    const history = useHistory();
    const location = useLocation();
    const queryParam =
        new URLSearchParams(location.search).get("query") || null;

    const [query, setQuery] = useState(queryParam);
    const [search, setSearch] = useState(query);
    const [loadOnScroll, setLoadOnScroll] = useState(true);

    const [users, setUsers] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [totalMatches, setTotalMatches] = useState(null);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(query);
        history.push(query ? `/users/search?query=${query}` : "/users/search");
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

            <form
                className="flex gap-4 p-4 border-b-2 border-primary-700"
                onSubmit={handleSubmit}
            >
                <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Search"
                    value={query || ""}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <Button>Search</Button>
            </form>

            <div className="mx-6">
                {users.length > 0 &&
                    users.map((user) => (
                        <UserCard
                            className="my-4 pb-4 border-b border-primary-700"
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
                    <div className="flex justify-center items-center h-24 text-primary-400">
                        Your search returned no results
                    </div>
                )}
            </div>
        </Container>
    );
}
