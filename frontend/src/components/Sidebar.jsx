import {
    ChatIcon,
    MusicNoteIcon,
    NewspaperIcon,
    PhotographIcon,
    UserCircleIcon,
    UserGroupIcon,
    UsersIcon,
    VideoCameraIcon,
} from "@heroicons/react/outline";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { NavigationLink } from "../ui/NavigationLink";
import { SidebarForm } from ".//SidebarForm";

export function Sidebar() {
    const { loggedIn } = useContext(UserContext);

    return (
        <div className="flex sticky top-14 flex-col flex-shrink-0 pr-4 w-48 h-full">
            {loggedIn ? (
                <>
                    <NavigationLink
                        to="/me"
                        icon={UserCircleIcon}
                        text="My Profile"
                    />
                    <NavigationLink
                        to="/feed"
                        icon={NewspaperIcon}
                        text="Feed"
                    />
                    <NavigationLink to="/chats" icon={ChatIcon} text="Chats" />
                    <NavigationLink
                        to="/friends"
                        icon={UsersIcon}
                        text="Friends"
                    />
                    <NavigationLink
                        to="/groups"
                        icon={UserGroupIcon}
                        text="Groups"
                    />
                    <NavigationLink
                        to="/photos"
                        icon={PhotographIcon}
                        text="Photos"
                    />
                    <NavigationLink
                        to="/music"
                        icon={MusicNoteIcon}
                        text="Music"
                    />
                    <NavigationLink
                        to="/videos"
                        icon={VideoCameraIcon}
                        text="Videos"
                    />
                </>
            ) : (
                <SidebarForm />
            )}
        </div>
    );
}
