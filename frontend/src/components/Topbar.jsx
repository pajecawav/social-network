import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../ui/Input";
import { buildSearchString } from "../utils";
import { CircleAvatar } from "./CircleAvatar";
import { Dropdown } from "./Dropdown";

export function Topbar() {
    const { loggedIn, user, logout } = useContext(UserContext);
    const [query, setQuery] = useState("");
    const history = useHistory();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
        history.push({
            pathname: "/users/search",
            search: buildSearchString({ query }),
        });
        setQuery("");
    };

    return (
        <div className="sticky top-0 z-50 h-12 border-b-2 shadow-md bg-primary-900 border-primary-700">
            <div className="relative flex items-center w-full h-full max-w-5xl px-3 mx-auto">
                <div className="w-48">
                    <Link className="flex w-max" to="/">
                        <Logo />
                    </Link>
                </div>

                <form className="hidden sm:block" onSubmit={handleSearch}>
                    <Input
                        className="px-3 w-60 rounded-xl"
                        flat={true}
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </form>

                {loggedIn && (
                    <div
                        className="flex items-center self-stretch h-auto gap-3 px-2 ml-auto transition-colors duration-200 cursor-pointer hover:bg-primary-700"
                        onClick={() => {
                            if (!isDropdownOpen) {
                                setIsDropdownOpen(true);
                            }
                        }}
                    >
                        <div>{user.firstName}</div>
                        <div className="flex-shrink-0 w-8">
                            <CircleAvatar fileName={user.avatar?.fullName} />
                        </div>
                    </div>
                )}

                {loggedIn && (
                    <Dropdown
                        className="py-2 border shadow-md right-3 top-12 min-w-40 bg-primary-700 border-primary-600"
                        isOpen={isDropdownOpen}
                        onRequestClose={() => setIsDropdownOpen(false)}
                    >
                        <div className="flex flex-col gap-1 transition-colors duration-200">
                            <Link
                                className="flex gap-4 p-2 cursor-pointer hover:bg-primary-600"
                                to={`/users/${user.userId}`}
                            >
                                <div className="flex-shrink-0 w-8">
                                    <CircleAvatar
                                        fileName={user.avatar?.fullName}
                                    />
                                </div>
                                {user.firstName} {user.lastName}
                            </Link>

                            <div className="h-px bg-primary-600" />

                            <div
                                className="px-2 py-1 cursor-pointer hover:bg-primary-600"
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
