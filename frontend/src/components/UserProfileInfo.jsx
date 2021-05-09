import clsx from "clsx";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { updateUser } from "../api";
import { formatLastSeen } from "../utils";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Container } from "./Container";
import { Dropdown } from "./Dropdown";

export function UserProfileInfo({ user, onStatusUpdated }) {
    const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const { user: currentUser } = useContext(UserContext);
    const isMe = currentUser && currentUser.userId === user.userId;

    const handleUpdateStatus = (event) => {
        event.preventDefault();
        updateUser(user.userId, { status: newStatus || null })
            .then(() => {
                setIsEditStatusOpen(false);
                onStatusUpdated(newStatus);
            })
            .catch(console.error);
    };

    return (
        <Container className="p-4">
            <div className="mb-2 pb-2 border-b-2 border-primary-700">
                <div className="flex items-center gap-2">
                    <div className="text-lg font-medium">
                        {user.firstName} {user.lastName}
                    </div>
                    <div className="ml-auto text-sm text-primary-500">
                        {user.isOnline || isMe
                            ? "online"
                            : `last seen ${formatLastSeen(user.lastSeen)}`}
                    </div>
                </div>
                <div>
                    <div
                        className={clsx(
                            "-mx-2 px-2 text-sm",
                            isMe && "cursor-pointer hover:bg-primary-600"
                        )}
                        onClick={() => {
                            if (isMe && !isEditStatusOpen) {
                                setIsEditStatusOpen(true);
                            }
                        }}
                    >
                        {user.status ? (
                            <div>{user.status}</div>
                        ) : (
                            isMe && (
                                <div className="text-primary-500">
                                    Set status
                                </div>
                            )
                        )}
                    </div>
                    {isMe && (
                        <Dropdown
                            isOpen={isEditStatusOpen}
                            className="p-3 shadow-md rounded-md border border-primary-800 bg-primary-600"
                            onRequestClose={() => {
                                setNewStatus("");
                                setIsEditStatusOpen(false);
                            }}
                        >
                            <form
                                className="flex gap-2"
                                onSubmit={handleUpdateStatus}
                            >
                                <Input
                                    autoFocus={true}
                                    value={newStatus}
                                    onChange={(event) =>
                                        setNewStatus(event.target.value)
                                    }
                                />
                                <Button onClick={handleUpdateStatus}>
                                    Save
                                </Button>
                            </form>
                        </Dropdown>
                    )}
                </div>
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
