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
                <CircleAvatar />
            </Link>
            <div className="ml-4 h-auto">
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
