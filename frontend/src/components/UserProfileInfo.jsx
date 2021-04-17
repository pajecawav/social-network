import { Container } from "./Container";

export function UserProfileInfo({ user }) {
    return (
        <Container>
            <div className="text-lg font-medium">
                {user.firstName} {user.lastName}
            </div>
            {user.status && <div>{user.status}</div>}
        </Container>
    );
}
