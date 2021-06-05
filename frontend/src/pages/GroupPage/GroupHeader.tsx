import { useContext } from "react";
import { CircleAvatar } from "../../components/CircleAvatar";
import { Container } from "../../components/Container";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { GroupContext } from "../../contexts/GroupContext";
import { Button } from "../../ui/Button";

export const GroupHeader = () => {
    const { group, toggleFollow } = useContext(GroupContext);

    if (!group) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container className="flex gap-4 p-4 md:col-span-2">
            <div className="flex gap-4">
                <div className="w-16">
                    <CircleAvatar
                        className="flex-shrink-0"
                        identiconSeed={group.groupId}
                    />
                </div>
                <div>
                    <div>{group.name}</div>
                    {group.shortDescription && (
                        <div className="text-primary-500">
                            {group.shortDescription}
                        </div>
                    )}
                </div>
            </div>
            {typeof group.isFollowing === "boolean" && (
                <Button
                    className="self-start ml-auto"
                    size="thin"
                    onClick={toggleFollow}
                >
                    {group.isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </Container>
    );
};
