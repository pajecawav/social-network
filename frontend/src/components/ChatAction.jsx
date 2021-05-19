import clsx from "clsx";
import { Link } from "react-router-dom";

function UserProfileLink({ user }) {
    return (
        <Link className="hover:underline" to={`/users/${user.userId}`}>
            {user.firstName} {user.lastName}
        </Link>
    );
}

function renderActionText(user, action) {
    const fromUser = <UserProfileLink user={user} />;
    const towardsUser = action.towardsUser ? (
        <UserProfileLink user={action.towardsUser} />
    ) : null;

    switch (action.chatActionType) {
        case "create":
            return <>{fromUser} created chat</>;
        case "invite":
            return (
                <>
                    {fromUser} invited {towardsUser}
                </>
            );
        case "leave":
            return <>{fromUser} left</>;
        case "kick":
            return (
                <>
                    {fromUser} kicked {towardsUser}
                </>
            );
        case "join":
            return <>{fromUser} joined</>;
        default:
            throw new Error(`Unknown action type ${action.chatActionType}`);
    }
}

export function ChatAction({ user, action, className }) {
    return (
        <div className={clsx("m-auto text-primary-500", className)}>
            {renderActionText(user, action)}
        </div>
    );
}
