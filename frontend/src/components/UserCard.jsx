import clsx from "clsx";
import { memo } from "react";
import { Link } from "react-router-dom";
import { CircleAvatar } from "./CircleAvatar";

export const UserCard = memo(
    ({ user, className, avatarClassName, children }) => (
        <div className={clsx("flex", className)}>
            <Link
                className={clsx("flex-shrink-0", avatarClassName || "w-16")}
                to={`/users/${user.userId}`}
            >
                <CircleAvatar
                    fileName={user.avatar?.fullName}
                    isOnline={user.isOnline}
                />
            </Link>
            <div className="h-auto mx-4">
                <Link
                    className="break-all text-primary-200 hover:underline"
                    to={`/users/${user.userId}`}
                >
                    {user.firstName} {user.lastName}
                </Link>
            </div>
            {children}
        </div>
    )
);
