import {
    ChatIcon,
    MenuIcon,
    NewspaperIcon,
    SearchIcon,
    UserCircleIcon,
} from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

function NavigationItem({ to, icon: Icon }) {
    return (
        <NavLink
            to={to}
            className="text-primary-500"
            activeClassName="text-secondary-600"
        >
            <Icon className="h-8" />
        </NavLink>
    );
}

export function MobileNavigationBar() {
    return (
        <div className="absolute flex justify-around items-center h-12 w-screen bottom-0 left-0 bg-primary-700 ">
            <NavigationItem to="/me" icon={UserCircleIcon} />
            <NavigationItem to="/feed" icon={NewspaperIcon} />
            <NavigationItem to="/users/search" icon={SearchIcon} />
            <NavigationItem to="/chats" icon={ChatIcon} />
            <NavigationItem to="/menu" icon={MenuIcon} />
        </div>
    );
}
