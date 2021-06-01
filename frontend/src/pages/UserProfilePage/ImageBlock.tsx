import clsx from "clsx";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { sendOrAcceptFriendRequest, unfriend } from "../../api";
import { Avatar } from "../../components/Avatar";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Container } from "../../components/Container";
import { SendMessageModal } from "../../components/SendMessageModal";
import { FriendStatus, User } from "../../types";
import { Button } from "../../ui/Button";
import { buildSearchString } from "../../utils";

export const FRIEND_STATUS_TO_ACTION_TEXT: Record<FriendStatus, string> = {
    friend: "Unfriend",
    not_friend: "Send request",
    request_sent: "Request sent",
    request_received: "Accept request",
};

type ImageBlockProps = {
    user: User;
    isMe: boolean;
    onFriendStatusChanged: (newStatus: FriendStatus) => void;
    className?: string;
};

export const ImageBlock = ({
    user,
    isMe,
    onFriendStatusChanged,
    className,
}: ImageBlockProps) => {
    const history = useHistory();
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);

    const navigateEditProfilePage = () => {
        history.push("/edit");
    };

    const handleFriendAction = () => {
        if (user.friendStatus === "friend") {
            unfriend(user.userId)
                .then(() => {
                    onFriendStatusChanged("not_friend");
                })
                .catch(console.error);
        } else {
            sendOrAcceptFriendRequest(user.userId)
                .then((response) => {
                    onFriendStatusChanged(response.data.friendStatus);
                })
                .catch(console.error);
        }
    };

    return (
        <Container className={clsx("flex flex-col gap-4 p-4", className)}>
            <div className="relative">
                <Avatar fileName={user.avatar?.filename} />
                {isMe && !user.avatar && (
                    <Link
                        className="absolute text-primary-400 text-center w-full bottom-[7%] hover:underline "
                        to={{
                            pathname: "/edit",
                            search: buildSearchString({ section: "avatar" }),
                        }}
                    >
                        Upload a profile image
                    </Link>
                )}
            </div>
            {isMe && (
                <Button size="thin" onClick={navigateEditProfilePage}>
                    Edit
                </Button>
            )}

            {!isMe && (
                <>
                    <Button
                        size="thin"
                        onClick={() => setIsSendMessageModalOpen(true)}
                    >
                        Write message
                    </Button>

                    <Button
                        disabled={user.friendStatus === "request_sent"}
                        size="thin"
                        onClick={() => {
                            if (user.friendStatus === "friend") {
                                setIsUnfriendModalOpen(true);
                            } else {
                                handleFriendAction();
                            }
                        }}
                    >
                        {FRIEND_STATUS_TO_ACTION_TEXT[user.friendStatus!]}
                    </Button>
                </>
            )}

            <SendMessageModal
                isOpen={isSendMessageModalOpen}
                toUserId={user.userId}
                onRequestClose={() => setIsSendMessageModalOpen(false)}
                onMessageSent={() => setIsSendMessageModalOpen(false)}
            />
            {!isMe && (
                <ConfirmationModal
                    isOpen={
                        user.friendStatus === "friend" && isUnfriendModalOpen
                    }
                    title="Unfriend user"
                    onConfirm={handleFriendAction}
                    onRequestClose={() => setIsUnfriendModalOpen(false)}
                >
                    <div>
                        Are you sure you want to unfriend{" "}
                        <span className="font-semibold text-secondary-500">
                            {user.firstName} {user.lastName}
                        </span>
                        ?
                    </div>
                </ConfirmationModal>
            )}
        </Container>
    );
};
