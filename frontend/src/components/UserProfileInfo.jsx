import dayjs from "dayjs";
import { Container } from "./Container";

export function UserProfileInfo({ user }) {
    return (
        <Container className="p-4">
            <div className="mb-2 border-b-2 border-primary-700">
                <div className="mb-2 text-lg font-medium">
                    {user.firstName} {user.lastName}
                </div>
                {user.status && <div className="mb-2">{user.status}</div>}
            </div>

            <div className="flex flex-col gap-3 mt-2 text-sm">
                {user.birthdate && (
                    <div className="flex">
                        <div className="w-32 text-primary-400">Birthday:</div>
                        <div>
                            {dayjs(user.birthdate).format("MMMM D, YYYY")}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}
