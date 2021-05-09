export function ChatAction({ user, action }) {
    // TODO render message based on action type
    return (
        <div className="m-auto text-primary-500">
            {`${user.firstName} ${user.lastName} created chat`}
        </div>
    );
}
