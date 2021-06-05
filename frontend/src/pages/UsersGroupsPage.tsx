import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { getUsersGroups } from "../api";
import { CircleAvatar } from "../components/CircleAvatar";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { UserContext } from "../contexts/UserContext";
import { useSearchParams } from "../hooks/useSearchParams";
import { Group } from "../types";

const GroupCard = ({ group }: { group: Group }) => {
    return (
        <div className="flex gap-4">
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

export const UsersGroupsPage = () => {
    const { loggedIn, user } = useContext(UserContext);
    const { id: userId = null } = useSearchParams();
    const history = useHistory();
    const [groups, setGroups] = useState<Group[] | null>(null);

    useEffect(() => {
        if (userId === null && !loggedIn) {
            history.push("/login");
        }

        getUsersGroups(userId ? +userId : user!.userId)
            .then((response) => setGroups(response.data))
            .catch(console.error);
    }, [userId, history, loggedIn, user]);

    return (
        <Container className="flex flex-col flex-grow">
            <HeaderWithCount
                title="Groups"
                count={groups ? groups.length : null}
            />
            {groups === null ? (
                <LoadingPlaceholder />
            ) : groups.length > 0 ? (
                <div className="flex flex-col gap-4 p-4">
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
