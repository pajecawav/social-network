import { useEffect, useState } from "react";
import { getUser } from "../api";
import { Container } from "../components/Container";
import { LoadingContentWrapper } from "../components/LoadingContentWrapper";
import { SquareImage } from "../components/SquareImage";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { Button } from "../ui/Button";

function ProfileImage() {
    return (
        <Container className="flex flex-col gap-4 p-4">
            <SquareImage className="w-60 h-60" />
            <Button className="py-1 text-gray-500 bg-purple-200">Edit</Button>
        </Container>
    );
}

export function UserProfilePage({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser(userId)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => console.error(error));
    }, [userId]);

    return (
        <LoadingContentWrapper className="min-h-60" isLoading={user === null}>
            <div className="flex flex-grow gap-4">
                <div className="min-w-60">
                    <ProfileImage />
                </div>
                <div className="flex-grow">
                    <UserProfileInfo user={user} />
                </div>
            </div>
        </LoadingContentWrapper>
    );
}
