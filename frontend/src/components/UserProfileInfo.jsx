import { HorizontalSeparator } from "../ui/HorizontalSeparator";
import { Container } from "./Container";
import dayjs from "dayjs";

export function UserProfileInfo({ user }) {
    return (
        <Container className="p-4">
            <div className="text-lg font-medium mb-2">
                {user.firstName} {user.lastName}
            </div>
            {user.status && <div className="mb-2">{user.status}</div>}

            <HorizontalSeparator />

            <div className="mt-2 flex flex-col gap-3 text-sm">
                {user.birthdate && (
                    <div className="flex">
                        <div className="text-gray-400 w-32">Birthday:</div>
                        <div>
                            {dayjs(user.birthdate).format("MMMM D, YYYY")}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}
