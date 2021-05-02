import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import { CircleAvatar } from "./CircleAvatar";

export function UserCard({ user, className, children }) {
    return (
        <div className={clsx("flex my-4", className)}>
            <Link to={`/users/${user.userId}`}>
                <CircleAvatar />
            </Link>
            <div className="ml-6 h-auto">
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
