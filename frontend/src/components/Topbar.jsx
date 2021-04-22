import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../ui/Input";
import { CircleAvatar } from "./CircleAvatar";

export function Topbar() {
    const { loggedIn, user, logout } = useContext(UserContext);
    const [query, setQuery] = useState("");
    const history = useHistory();

    const handleSearch = (event) => {
        event.preventDefault();
        history.push(query ? `/users/search?query=${query}` : "/users/search");
        setQuery("");
    };

    return (
        <div className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="flex items-center w-full max-w-4xl mx-auto">
                <div className="w-48 my-2">
                    <Link className="flex ml-4 w-max sm:ml-0" to="/">
                        <Logo />
                    </Link>
                </div>
                <form className="hidden my-2 sm:block" onSubmit={handleSearch}>
                    <Input
                        className="px-3 bg-gray-100 rounded-xl"
                        flat={true}
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </form>
                {loggedIn && (
                    <div
                        className="flex items-center gap-3 px-2 ml-auto mr-4 transition-colors duration-200 cursor-pointer sm:mr-0 hover:bg-gray-50"
                        onClick={logout}
                    >
                        <div>{user.firstName}</div>
                        <CircleAvatar size={2} />
                    </div>
                )}
            </div>
        </div>
    );
}
