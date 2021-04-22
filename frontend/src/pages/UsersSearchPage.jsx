import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getUsers } from "../api";
import { Container } from "../components/Container";
import { UserCard } from "../components/UserCard";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";
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
            className="flex flex-col"
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

            <div className={clsx("mx-6", users.length !== 0 && "mb-6")}>
                {users.length > 0 &&
                    users.map((user) => (
                        <React.Fragment key={user.userId}>
                            <UserCard user={user} />
                            <HorizontalSeparator />
                        </React.Fragment>
                    ))}

                {loadOnScroll && (
                    <Waypoint onEnter={fetchMoreUsers}>
                        <div
                            className={clsx(
                                "flex mt-6",
                                users.length === 0 && "h-20"
                            )}
                        >
                            <Spinner className="m-auto" />
                        </div>
                    </Waypoint>
                )}

                {noResults && (
                    <div className="flex items-center justify-center h-24 text-gray-400">
                        Your search returned no results
                    </div>
                )}
            </div>
        </Container>
    );
}
