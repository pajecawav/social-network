import { useContext } from "react";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";

export function Topbar() {
    const { user, logout } = useContext(UserContext);

    return (
        <div className="sticky top-0 z-50 py-1 bg-white shadow-sm">
            <div className="flex items-center w-full max-w-4xl px-2 m-auto">
                <Logo />
                {user && (
                    <div className="ml-auto cursor-pointer" onClick={logout}>
                        {user.username}
                    </div>
                )}
            </div>
        </div>
    );
}
