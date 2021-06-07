import {
    ChatIcon,
    MenuIcon,
    NewspaperIcon,
    SearchIcon,
    UserCircleIcon,
} from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

type NavigationItemProps = {
    to: string;
    icon: any;
};

const NavigationItem = ({ to, icon: Icon }: NavigationItemProps) => (
    <NavLink
        to={to}
        className="text-primary-500"
        activeClassName="text-secondary-600"
    >
        <Icon className="h-8" />
    </NavLink>
);

export function MobileNavigationBar() {
    return (
        <div className="fixed bottom-0 left-0 flex items-center justify-around w-screen h-12 p-4 bg-primary-700 ">
            <NavigationItem to="/me" icon={UserCircleIcon} />
            <NavigationItem to="/feed" icon={NewspaperIcon} />
            <NavigationItem to="/search" icon={SearchIcon} />
            <NavigationItem to="/chats" icon={ChatIcon} />
            <NavigationItem to="/menu" icon={MenuIcon} />
        </div>
    );
}
