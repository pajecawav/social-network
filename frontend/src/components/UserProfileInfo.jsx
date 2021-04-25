import { HorizontalSeparator } from "../ui/HorizontalSeparator";
import { Container } from "./Container";
import dayjs from "dayjs";

export function UserProfileInfo({ user }) {
    return (
        <Container className="p-4">
            <div className="mb-2 text-lg font-medium">
                {user.firstName} {user.lastName}
            </div>
            {user.status && <div className="mb-2">{user.status}</div>}

            <HorizontalSeparator />

            <div className="flex flex-col gap-3 mt-2 text-sm">
                {user.birthdate && (
                    <div className="flex">
                        <div className="w-32 text-gray-400">Birthday:</div>
                        <div>
                            {dayjs(user.birthdate).format("MMMM D, YYYY")}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}
