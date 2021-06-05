import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { followGroup, getGroup, getGroupUsers, unfollowGroup } from "../api";
import { Group, User } from "../types";
import { UserContext } from "./UserContext";

type GroupContextValue = {
    group: Group | null;
    randomUsers: User[] | null;
    totalUsers: number;
    posts: any[] | null;
    toggleFollow: () => void;
};

export const GroupContext = createContext<GroupContextValue>(
    {} as GroupContextValue
);

type GroupContextProviderProps = PropsWithChildren<{
    groupId: string | number;
}>;

export const GroupContextProvider = ({
    groupId,
    children,
}: GroupContextProviderProps) => {
    const { user } = useContext(UserContext);

    const [group, setGroup] = useState<Group | null>(null);
    const [randomUsers, setRandomUsers] = useState<User[] | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        getGroup(groupId)
            .then((response) => setGroup(response.data))
            .catch(console.error);

        getGroupUsers(groupId)
            .then((response) => {
                setRandomUsers(response.data.users);
                setTotalUsers(response.data.totalMatches);
            })
            .catch(console.error);
    }, [groupId]);

    const toggleFollow = () => {
        if (!group || !user) return;

        if (group.isFollowing) {
            unfollowGroup(user.userId, groupId).then(() => {
                setGroup({ ...group, isFollowing: false });
                setTotalUsers(totalUsers - 1);
            });
        } else {
            followGroup(user.userId, groupId).then(() => {
                setGroup({ ...group, isFollowing: true });
                setTotalUsers(totalUsers + 1);
            });
        }
    };

    return (
        <GroupContext.Provider
            value={{
                group,
                randomUsers: randomUsers,
                totalUsers,
                posts,
                toggleFollow,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};
