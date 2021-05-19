import clsx from "clsx";
import { Link } from "react-router-dom";
import { CircleAvatar } from "./CircleAvatar";

export function UserCard({ user, className, avatarClassName, children }) {
    return (
        <div className={clsx("flex", className)}>
            <Link
                className={clsx(avatarClassName || "flex-shrink-0 w-16")}
                to={`/users/${user.userId}`}
            >
                <CircleAvatar
                    fileName={user.avatar?.fullName}
                    isOnline={user.isOnline}
                />
            </Link>
            <div className="h-auto mx-4">
                <Link
                    className="text-primary-200 hover:underline"
                    to={`/users/${user.userId}`}
                >
                    {user.firstName} {user.lastName}
                </Link>
            </div>
            {children}
        </div>
    );
}
