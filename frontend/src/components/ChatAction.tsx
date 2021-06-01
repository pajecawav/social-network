import clsx from "clsx";
import { Link } from "react-router-dom";
import { ChatAction as ChatActionType, User } from "../types";

const UserProfileLink = ({ user }: { user: User }) => (
    <Link className="hover:underline" to={`/users/${user.userId}`}>
        {user.firstName} {user.lastName}
    </Link>
);

const renderActionText = (user: User, action: ChatActionType) => {
    const fromUser = <UserProfileLink user={user} />;

    switch (action.chatActionType) {
        case "create":
            return <>{fromUser} created chat</>;
        case "invite":
            return (
                <>
                    {fromUser} invited{" "}
                    {<UserProfileLink user={action.towardsUser} />}
                </>
            );
        case "leave":
            return <>{fromUser} left</>;
        case "kick":
            return (
                <>
                    {fromUser} kicked{" "}
                    {<UserProfileLink user={action.towardsUser} />}
                </>
            );
        case "join":
            return <>{fromUser} joined</>;
    }
};

type ChatActionProps = {
    user: User;
    action: ChatActionType;
    className?: string;
};

export const ChatAction = ({ user, action, className }: ChatActionProps) => {
    return (
        <div className={clsx("m-auto text-primary-500", className)}>
            {renderActionText(user, action)}
        </div>
    );
};
