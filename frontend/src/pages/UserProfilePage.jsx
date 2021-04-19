import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getUser } from "../api";
import { Container } from "../components/Container";
import { LoadingContentWrapper } from "../components/LoadingContentWrapper";
import { SquareImage } from "../components/SquareImage";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";

function ProfileImage({ editable }) {
    const history = useHistory();

    const navigateEditProfilePage = () => {
        history.push("/edit");
    };

    return (
        <Container className="flex flex-col gap-4 p-4">
            <SquareImage className="w-60 h-60" />
            {editable && (
                <Button
                    className="py-1 text-gray-500 bg-purple-200"
                    onClick={navigateEditProfilePage}
                >
                    Edit
                </Button>
            )}
        </Container>
    );
}

export function UserProfilePage({ userId }) {
    const { user: currentUser } = useContext(UserContext);
    const [user, setUser] = useState(null);

    const isMe = user && currentUser?.userId === user.userId;

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
                    <ProfileImage editable={isMe} />
                </div>
                <div className="flex-grow">
                    <UserProfileInfo user={user} />
                </div>
            </div>
        </LoadingContentWrapper>
    );
}
