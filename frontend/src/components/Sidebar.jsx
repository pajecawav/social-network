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
import { NavigationLink } from "../ui/NavigationLink";

export function Sidebar() {
    return (
        <div className="sticky flex flex-col flex-shrink-0 h-full pr-3 top-14 w-36">
            <NavigationLink to="/me" icon={UserCircleIcon} text="My Profile" />
            <NavigationLink to="/feed" icon={NewspaperIcon} text="Feed" />
            <NavigationLink to="/messages" icon={ChatIcon} text="Messages" />
            <NavigationLink to="/friends" icon={UsersIcon} text="Friends" />
            <NavigationLink to="/groups" icon={UserGroupIcon} text="Groups" />
            <NavigationLink to="/photos" icon={PhotographIcon} text="Photos" />
            <NavigationLink to="/music" icon={MusicNoteIcon} text="Music" />
            <NavigationLink to="/videos" icon={VideoCameraIcon} text="Videos" />
        </div>
    );
}
