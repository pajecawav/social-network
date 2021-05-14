import clsx from "clsx";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { getUserInfo, updateUser } from "../api";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { formatLastSeen } from "../utils";
import { Container } from "./Container";
import { Dropdown } from "./Dropdown";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function InfoField({ label, text, children }) {
    return (
        <>
            <div className="text-primary-400">{label}</div>
            <div>{text || children}</div>
        </>
    );
}

export function UserProfileInfo({ user, onStatusUpdated }) {
    const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const { user: currentUser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(null);
    const isMe = currentUser && currentUser.userId === user.userId;

    useEffect(() => {
        getUserInfo(user.userId)
            .then((response) => setUserInfo(response.data))
            .catch(console.error);
    }, [user.userId]);

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
            {userInfo === null ? (
                <LoadingPlaceholder className="h-full min-h-96" />
            ) : (
                <>
                    <div className="mb-2 pb-2 border-b-2 border-primary-700">
                        <div className="flex items-center gap-2">
                            <div className="text-lg font-medium">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="ml-auto text-sm text-primary-500">
                                {user.isOnline || isMe
                                    ? "online"
                                    : `last seen ${formatLastSeen(
                                          user.lastSeen
                                      )}`}
                            </div>
                        </div>
                        <div>
                            <div
                                className={clsx(
                                    "-mx-2 px-2 text-sm",
                                    isMe &&
                                        "cursor-pointer hover:bg-primary-600"
                                )}
                                onClick={() => {
                                    if (isMe && !isEditStatusOpen) {
                                        setIsEditStatusOpen(true);
                                    }
                                }}
                            >
                                {userInfo.status ? (
                                    <div>{userInfo.status}</div>
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
                                            className="w-72"
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

                    <div className="grid grid-cols-[max-content,auto] items-center gap-3 mt-2 text-sm">
                        {userInfo.gender && (
                            <InfoField label="Gender:" text={userInfo.gender} />
                        )}
                        {userInfo.birthdate && (
                            <InfoField
                                label="Birthday:"
                                text={dayjs(userInfo.birthdate).format(
                                    "MMMM D, YYYY"
                                )}
                            />
                        )}
                        {userInfo.relationship && (
                            <InfoField
                                label="Relationship:"
                                text={userInfo.relationship}
                            />
                        )}
                        {userInfo.country && (
                            <InfoField
                                label="Country:"
                                text={userInfo.country}
                            />
                        )}
                        {userInfo.city && (
                            <InfoField label="City:" text={userInfo.city} />
                        )}
                        {userInfo.website && (
                            <InfoField label="Website:">
                                <a
                                    className="cursor-pointer hover:underline"
                                    href={userInfo.website}
                                    rel="noreferrer noopener"
                                >
                                    {userInfo.website}
                                </a>
                            </InfoField>
                        )}
                        {userInfo.email && (
                            <InfoField label="Email:">
                                <a
                                    className="cursor-pointer hover:underline"
                                    href={`mailto:${userInfo.email}`}
                                >
                                    {userInfo.email}
                                </a>
                            </InfoField>
                        )}
                    </div>
                </>
            )}
        </Container>
    );
}
