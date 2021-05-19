import {
    ChatIcon,
    ChevronRightIcon,
    LogoutIcon,
    MusicNoteIcon,
    NewspaperIcon,
    PhotographIcon,
    UserCircleIcon,
    UserGroupIcon,
    UsersIcon,
    VideoCameraIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { NavigationLink } from "../ui/NavigationLink";
import { SidebarForm } from ".//SidebarForm";
import { CircleAvatar } from "./CircleAvatar";

export function NavigationBar({ isFullPage = false }) {
    const { loggedIn, user, logout } = useContext(UserContext);

    return (
        <div
            className={clsx(
                "flex flex-col flex-shrink-0 h-full",
                isFullPage ? "" : "sticky top-16 w-48 pr-4"
            )}
        >
            {loggedIn ? (
                <>
                    {isFullPage ? (
                        <Link
                            className="flex gap-4 p-4 mb-2 rounded-lg bg-primary-700"
                            to="/me"
                        >
                            <div className="flex-shrink-0 w-12">
                                <CircleAvatar
                                    fileName={user.avatar?.fullName}
                                />
                            </div>
                            <div>
                                <div>
                                    {user.firstName} {user.lastName}
                                </div>
                                <div className="text-primary-500">
                                    Open profile
                                </div>
                            </div>
                            <ChevronRightIcon className="w-5 ml-auto text-primary-500" />
                        </Link>
                    ) : (
                        <NavigationLink
                            to="/me"
                            icon={UserCircleIcon}
                            text="My Profile"
                            isBigIcon={true}
                        />
                    )}
                    <NavigationLink
                        to="/feed"
                        icon={NewspaperIcon}
                        text="Feed"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/chats"
                        icon={ChatIcon}
                        text="Chats"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/friends"
                        icon={UsersIcon}
                        text="Friends"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/groups"
                        icon={UserGroupIcon}
                        text="Groups"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/photos"
                        icon={PhotographIcon}
                        text="Photos"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/music"
                        icon={MusicNoteIcon}
                        text="Music"
                        isBigIcon={true}
                    />
                    <NavigationLink
                        to="/videos"
                        icon={VideoCameraIcon}
                        text="Videos"
                        isBigIcon={true}
                    />
                    {isFullPage && (
                        <>
                            <div className="my-2 border-t-2 border-primary-600" />
                            <NavigationLink
                                to="#"
                                icon={LogoutIcon}
                                text="Sign out"
                                isBigIcon={true}
                                onClick={logout}
                            />
                        </>
                    )}
                </>
            ) : (
                <SidebarForm />
            )}
        </div>
    );
}
