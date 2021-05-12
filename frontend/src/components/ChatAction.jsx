import clsx from "clsx";
import { Link } from "react-router-dom";

function UserProfileLink({ user }) {
    return (
        <Link className="hover:underline" to={`/users/${user.userId}`}>
            {user.firstName} {user.lastName}
        </Link>
    );
}

export function ChatAction({ user, action, className }) {
    let content;
    const fromUser = <UserProfileLink user={user} />;
    const towardsUser = action.towardsUser ? (
        <UserProfileLink user={user} />
    ) : null;

    switch (action.chatActionType) {
        case "create":
            content = <>{fromUser} created chat</>;
            break;
        case "invite":
            content = (
                <>
                    {fromUser} invited {towardsUser}
                </>
            );
            break;
        case "leave":
            content = <>{fromUser} left</>;
            break;
        case "kick":
            content = (
                <>
                    {fromUser} kicked {towardsUser}
                </>
            );
            break;
        default:
            throw Error(action.chatActionType);
    }

    return (
        <div className={clsx("m-auto text-primary-500", className)}>
            {content}
        </div>
    );
}
