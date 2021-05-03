import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../ui/Input";
import { CircleAvatar } from "./CircleAvatar";
import { Dropdown } from "./Dropdown";

export function Topbar() {
    const { loggedIn, user, logout } = useContext(UserContext);
    const [query, setQuery] = useState("");
    const history = useHistory();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
        history.push(query ? `/users/search?query=${query}` : "/users/search");
        setQuery("");
    };

    return (
        <div className="sticky h-12 top-0 z-50 bg-primary-900 shadow-md border-b-2 border-primary-700">
            <div className="flex relative h-full items-center px-3 mx-auto w-full max-w-4xl">
                <div className="w-48">
                    <Link className="flex w-max" to="/">
                        <Logo />
                    </Link>
                </div>

                <form className="hidden sm:block" onSubmit={handleSearch}>
                    <Input
                        className="px-3 bg-primary-100 rounded-xl"
                        flat={true}
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </form>

                {loggedIn && (
                    <div
                        className="h-auto flex self-stretch gap-3 items-center px-2 ml-auto transition-colors duration-200 cursor-pointer hover:bg-primary-700"
                        onClick={() => {
                            if (!isDropdownOpen) {
                                setIsDropdownOpen(true);
                            }
                        }}
                    >
                        <div>{user.firstName}</div>
                        <CircleAvatar size={2} />
                    </div>
                )}

                {loggedIn && (
                    <Dropdown
                        className="right-3 top-12 min-w-40 py-2 bg-primary-700 border border-primary-600 shadow-md"
                        isOpen={isDropdownOpen}
                        onRequestClose={() => setIsDropdownOpen(false)}
                    >
                        <div className="flex flex-col gap-1 transition-colors duration-200">
                            <Link
                                className="flex gap-4 p-2 cursor-pointer hover:bg-primary-600"
                                to={`/users/${user.userId}`}
                            >
                                <CircleAvatar size={2} />
                                {user.firstName} {user.lastName}
                            </Link>

                            <div className="h-px bg-primary-600" />

                            <div
                                className="py-1 px-2 cursor-pointer hover:bg-primary-600"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout();
                                }}
                            >
                                Sign out
                            </div>
                        </div>
                    </Dropdown>
                )}
            </div>
        </div>
    );
}
