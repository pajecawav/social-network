import { PlusIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { getUsersGroups } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useSearchParams } from "../hooks/useSearchParams";
import { Group } from "../types";
import { Button } from "../ui/Button";

const GroupCard = ({ group }: { group: Group }) => {
    return (
        <div className="flex gap-4 pb-4 mt-4 border-b border-primary-700 ">
            <Link
                to={`/groups/${group.groupId}`}
                className="flex-shrink-0 w-16"
            >
                <CircleAvatar
                    fileName={group.avatar?.filename}
                    identiconSeed={group.groupId}
                />
            </Link>
            <div>
                <Link
                    to={`/groups/${group.groupId}`}
                    className="hover:underline"
                >
                    {group.name}
                </Link>
                {group.shortDescription && (
                    <div className="text-primary-500">
                        {group.shortDescription}
                    </div>
                )}
            </div>
        </div>
    );
};

export const GroupListPage = () => {
    const { loggedIn, user } = useContext(UserContext);
    const { id: userId = null } = useSearchParams();
    const history = useHistory();
    const [groups, setGroups] = useState<Group[] | null>(null);

    const isSmallScreen = useIsSmallScreen();

    useEffect(() => {
        if (userId === null && !loggedIn) {
            history.push("/login");
        }

        getUsersGroups(userId ? +userId : user!.userId)
            .then((response) => setGroups(response.data))
            .catch(console.error);
    }, [userId, history, loggedIn, user]);

    return (
        <Container className="flex flex-col flex-grow min-h-full md:min-h-0">
            <HeaderWithCount
                className="flex"
                title="Groups"
                count={groups ? groups.length : null}
            >
                <Link to="/groups/create" className="self-start ml-auto">
                    {isSmallScreen ? (
                        <PlusIcon className="w-8 text-secondary-600" />
                    ) : (
                        <Button size="thin">Create</Button>
                    )}
                </Link>
            </HeaderWithCount>
            {groups === null ? (
                <LoadingPlaceholder />
            ) : groups.length > 0 ? (
                <div className="flex flex-col p-4">
                    {groups.map((group) => (
                        <GroupCard group={group} key={group.groupId} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-20 m-auto my-6 text-primary-400">
                    No groups were found
                </div>
            )}
        </Container>
    );
};
