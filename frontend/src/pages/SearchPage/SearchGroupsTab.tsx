import clsx from "clsx";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import { getGroups } from "../../api";
import { GroupCard } from "../../components/GroupCard";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useSearchParams } from "../../hooks/useSearchParams";
import { useTitle } from "../../hooks/useTitle";
import { Group } from "../../types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Spinner } from "../../ui/Spinner";
import { buildSearchString } from "../../utils";

export const SearchGroupsTab = () => {
    const history = useHistory();
    const { query: queryParam = null } = useSearchParams();

    const [query, setQuery] = useState(queryParam);
    const [search, setSearch] = useState(query);
    const [loadOnScroll, setLoadOnScroll] = useState(true);

    const [groups, setGroups] = useState<Group[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);

    const isSmallScreen = useIsSmallScreen();

    useTitle(`Search results` + (search ? ` for ${search}` : ""));

    useEffect(() => {
        setGroups([]);
        setLoadOnScroll(true);
        setNextCursor(null);
    }, [search]);

    useEffect(() => {
        setSearch(queryParam);
        setQuery(queryParam);
        setNextCursor(null);
    }, [queryParam]);

    const handleSearch = () => {
        history.push({
            pathname: "/search",
            search: buildSearchString({ query, section: "groups" }),
        });
    };

    const fetchMoreGroups = () => {
        getGroups({ query: search, cursor: nextCursor, limit: 20 }).then(
            (response) => {
                setGroups([...groups, ...response.data.groups]);
                setNextCursor(response.data.nextCursor);
                setLoadOnScroll(Boolean(response.data.nextCursor));
            }
        );
    };

    const noResults = !(loadOnScroll || groups.length);

    return (
        <div>
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
                {groups.length > 0 &&
                    groups.map((group) => (
                        <GroupCard
                            className="pb-4 my-4 border-b border-primary-700"
                            key={group.groupId}
                            group={group}
                        />
                    ))}

                {loadOnScroll && (
                    <Waypoint onEnter={fetchMoreGroups} bottomOffset={-200}>
                        <div
                            className={clsx(
                                "flex mt-6 mb-2",
                                groups.length === 0 && "h-20"
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
        </div>
    );
};
