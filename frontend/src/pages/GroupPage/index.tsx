import { useContext } from "react";
import { useParams } from "react-router";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import {
    GroupContext,
    GroupContextProvider,
} from "../../contexts/GroupContext";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { GroupContacts } from "./GroupContacts";
import { GroupHeader } from "./GroupHeader";
import { GroupPosts } from "./GroupPosts";
import { GroupUsers } from "./GroupUsers";
import { ManageGroupBlock } from "./ManageGroupBlock";

export const GroupPage = () => {
    const { groupId } = useParams<{ groupId: string }>();

    return (
        <GroupContextProvider groupId={groupId}>
            <GroupPageContent />
        </GroupContextProvider>
    );
};

const GroupInfoSidebar = () => {
    const { group } = useContext(GroupContext);
    const isSmallScreen = useIsSmallScreen();

    return (
        <div className="flex flex-col gap-4">
            {group?.isAdmin && <ManageGroupBlock />}
            {!isSmallScreen && <GroupUsers />}
            <GroupContacts admin={group!.admin} />
        </div>
    );
};

const GroupPageContent = () => {
    const { group } = useContext(GroupContext);
    const isSmallScreen = useIsSmallScreen();

    return group === null ? (
        <LoadingPlaceholder />
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr,16rem] gap-4 items-start">
            <GroupHeader />
            {isSmallScreen ? (
                <>
                    <GroupInfoSidebar />
                    <GroupPosts />
                </>
            ) : (
                <>
                    <GroupPosts />
                    <GroupInfoSidebar />
                </>
            )}
        </div>
    );
};
