import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { addFriend, getUser, unfriend } from "../api";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { SquareAvatar } from "../components/SquareAvatar";
import { UserProfileInfo } from "../components/UserProfileInfo";
import { UserContext } from "../contexts/UserContext";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";

function ImageBlock({ user, isMe }) {
    const history = useHistory();
    const [isFriend, setIsFriend] = useState(user?.isFriend === true);

    const navigateEditProfilePage = () => {
        history.push("/edit");
    };

    const handleToggleFriend = (event) => {
        event.preventDefault();

        if (isFriend) {
            unfriend(user.userId)
                .then(() => {
                    setIsFriend(false);
                })
                .catch(console.error);
        } else {
            addFriend(user.userId)
                .then(() => {
                    setIsFriend(true);
                })
                .catch(console.error);
        }
    };

    return (
        <Container className="flex flex-col gap-4 p-4 w-60">
            <SquareAvatar className="object-cover w-full" scale={13} />
            {isMe && (
                <Button
                    size="thin"
                    color="secondary"
                    onClick={navigateEditProfilePage}
                >
                    Edit
                </Button>
            )}
            {!isMe && (
                <Button
                    color="secondary"
                    size="thin"
                    onClick={handleToggleFriend}
                >
                    {isFriend === true ? "Unfriend" : "Add friend"}
                </Button>
            )}
        </Container>
    );
}

export function UserProfilePage({ userId }) {
    const { user: currentUser } = useContext(UserContext);
    const [user, setUser] = useState(null);

    const isMe = user && currentUser?.userId === user.userId;

    useTitle(user ? `${user.firstName} ${user.lastName}` : "Social Network", [
        user,
    ]);

    useEffect(() => {
        getUser(userId)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => console.error(error));
    }, [userId]);

    return user === null ? (
        <LoadingPlaceholder
            className="h-full min-h-96"
            loadingClassName="min-h-96"
            isLoading={user === null}
        />
    ) : (
        <div className="flex flex-grow gap-4">
            <ImageBlock user={user} isMe={isMe} />
            <div className="flex-grow">
                <UserProfileInfo user={user} />
            </div>
        </div>
    );
}
