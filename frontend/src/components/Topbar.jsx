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
        <div className="sticky h-12 top-0 z-50 bg-primary-900 shadow-md border-b-2 border-primary-700">
            <div className="flex h-full items-center px-3 mx-auto w-full max-w-4xl">
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
