import clsx from "clsx";
import { Link } from "react-router-dom";
import { CircleAvatar } from "../components/CircleAvatar";
import { Group } from "../types";

type GroupCardProps = {
    group: Group;
    className?: string;
};

export const GroupCard = ({ group, className }: GroupCardProps) => {
    return (
        <div
            className={clsx(
                "flex gap-4 pb-4 mt-4 border-b border-primary-700",
                className
            )}
        >
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
