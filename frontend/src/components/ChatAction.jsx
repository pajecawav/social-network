export function ChatAction({ user, action }) {
    let text;
    switch (action.chatActionType) {
        case "create":
            text = `${user.firstName} ${user.lastName} created chat`;
            break;
        case "invite":
            text = `${user.firstName} ${user.lastName} invited ${action.towardsUser.firstName} ${action.towardsUser.lastName}`;
            break;
        case "leave":
            text = `${user.firstName} ${user.lastName} left`;
            break;
        case "kick":
            text = `${user.firstName} ${user.lastName} kicked ${action.towardsUser.firstName} ${action.towardsUser.lastName}`;
            break;
        default:
            throw Error(action.chatActionType);
    }

    return <div className="m-auto text-primary-500">{text}</div>;
}
