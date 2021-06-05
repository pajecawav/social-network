import { useContext } from "react";
import { useParams } from "react-router";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import {
    GroupContext,
    GroupContextProvider,
} from "../../contexts/GroupContext";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { GroupHeader } from "./GroupHeader";
import { GroupPosts } from "./GroupPosts";
import { GroupUsers } from "./GroupUsers";

export const GroupPage = () => {
    const { groupId } = useParams<{ groupId: string }>();

    return (
        <GroupContextProvider groupId={groupId}>
            <GroupPageContent />
        </GroupContextProvider>
    );
};

const GroupPageContent = () => {
    const { group } = useContext(GroupContext);
    const isSmallScreen = useIsSmallScreen();

    return (
        <div>
            {group === null ? (
                <LoadingPlaceholder />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-[1fr,16rem] gap-4 items-start ">
                    <GroupHeader />
                    {isSmallScreen ? (
                        <>
                            <GroupUsers />
                            <GroupPosts />
                        </>
                    ) : (
                        <>
                            <GroupPosts />
                            <GroupUsers />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
