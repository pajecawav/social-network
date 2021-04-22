import React from "react";
import { Link } from "react-router-dom";
import { CircleAvatar } from "./CircleAvatar";

export function UserCard({ user, children }) {
    return (
        <div className="flex my-4">
            <Link to={`/users/${user.userId}`}>
                <CircleAvatar />
            </Link>
            <div className="h-auto ml-6">
                <Link
                    className="text-purple-600 hover:underline"
                    to={`/users/${user.userId}`}
                >
                    {user.firstName} {user.lastName}
                </Link>
            </div>
            {children}
        </div>
    );
}
