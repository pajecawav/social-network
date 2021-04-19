import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getUsers } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { Button } from "../ui/Button";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";

function UserCard({ user }) {
    return (
        <div className="flex my-4">
            <CircleAvatar />
            <div className="h-auto ml-6">
                <Link className="text-purple-600" to={`/users/${user.userId}`}>
                    {user.firstName} {user.lastName}
                </Link>
            </div>
        </div>
    );
}

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

    useEffect(() => {
        setUsers([]);
        setLoadOnScroll(true);
    }, [search]);

    useEffect(() => {
        setSearch(queryParam);
        setQuery(queryParam);
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
            setLoadOnScroll(response.data.nextCursor !== null);
        });
    };

    const noResults = !(loadOnScroll || users.length);

    return (
        <Container
            className="flex flex-col flex-grow"
            header={
                <>
                    <span>People</span>
                    {totalMatches > 0 && (
                        <span className="ml-3 text-gray-300">
                            {totalMatches}
                        </span>
                    )}
                </>
            }
        >
            <HorizontalSeparator />

            <form className="flex gap-4 p-4" onSubmit={handleSubmit}>
                <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Search"
                    value={query || ""}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <Button>Search</Button>
            </form>

            <HorizontalSeparator />

            {users.length > 0 && (
                <div className="mx-6 mt-2 mb-6">
                    {users.map((user) => (
                        <React.Fragment key={user.userId}>
                            <UserCard user={user} />
                            <HorizontalSeparator />
                        </React.Fragment>
                    ))}
                </div>
            )}

            {loadOnScroll && (
                <Waypoint onEnter={fetchMoreUsers}>
                    <Spinner />
                </Waypoint>
            )}

            {noResults && (
                <div className="m-auto text-gray-400">
                    Your search returned no results
                </div>
            )}
        </Container>
    );
}
