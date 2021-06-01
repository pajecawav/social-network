import clsx from "clsx";
import dayjs from "dayjs";
import {
    FormEvent,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { getUserInfo, updateUserInfo } from "../../api";
import { Container } from "../../components/Container";
import { Dropdown } from "../../components/Dropdown";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { UserContext } from "../../contexts/UserContext";
import { User, UserInfo } from "../../types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { formatLastSeen } from "../../utils";

type InfoFieldProps = PropsWithChildren<{
    label: string;
    text?: string;
}>;

const InfoField = ({ label, text, children }: InfoFieldProps) => {
    return (
        <>
            <div className="text-primary-400">{label}</div>
            <div>{text || children}</div>
        </>
    );
};

type UserProfileInfoProps = {
    user: User;
};

export const UserProfileInfo = ({ user }: UserProfileInfoProps) => {
    const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const { user: currentUser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(true);
    const isMe = currentUser && currentUser.userId === user.userId;

    useEffect(() => {
        getUserInfo(user.userId)
            .then((response) => setUserInfo(response.data))
            .catch(console.error);
    }, [user.userId]);

    const handleUpdateStatus = (event: FormEvent) => {
        event.preventDefault();
        updateUserInfo(user.userId, { status: newStatus || null })
            .then(() => {
                setIsEditStatusOpen(false);
                setUserInfo({ ...userInfo, status: newStatus });
            })
            .catch(console.error);
    };

    return (
        <Container className="p-4">
            {userInfo === null ? (
                <LoadingPlaceholder className="h-full min-h-96" />
            ) : (
                <>
                    <div className="pb-2 mb-2 border-b-2 border-primary-700">
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
                        <div className="relative">
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
                                    className="max-w-full p-3 border rounded-md shadow-md border-primary-800 bg-primary-600"
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
                                            onChange={setNewStatus}
                                        />
                                        <Button onClick={handleUpdateStatus}>
                                            Save
                                        </Button>
                                    </form>
                                </Dropdown>
                            )}
                        </div>
                    </div>

                    {Object.keys(userInfo).length > 0 && (
                        <>
                            <button
                                className="w-full px-2 py-1 text-center rounded-md bg-primary-700 text-primary-500"
                                onClick={() =>
                                    setIsUserInfoVisible(!isUserInfoVisible)
                                }
                            >
                                {isUserInfoVisible
                                    ? "Hide user information"
                                    : "Show user information"}
                            </button>
                            {isUserInfoVisible && (
                                <div className="grid grid-cols-[max-content,auto] items-center gap-3 mt-2 text-sm">
                                    {userInfo.gender && (
                                        <InfoField
                                            label="Gender:"
                                            text={userInfo.gender}
                                        />
                                    )}
                                    {userInfo.birthdate && (
                                        <InfoField
                                            label="Birthday:"
                                            text={dayjs(
                                                userInfo.birthdate
                                            ).format("MMMM D, YYYY")}
                                        />
                                    )}
                                    {userInfo.relationshipStatus && (
                                        <InfoField
                                            label="Relationship:"
                                            text={userInfo.relationshipStatus}
                                        />
                                    )}
                                    {userInfo.country && (
                                        <InfoField
                                            label="Country:"
                                            text={userInfo.country}
                                        />
                                    )}
                                    {userInfo.city && (
                                        <InfoField
                                            label="City:"
                                            text={userInfo.city}
                                        />
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
                            )}
                        </>
                    )}
                </>
            )}
        </Container>
    );
};
