import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../ui/Input";

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
        <div className="sticky top-0 z-50 py-2 bg-white shadow-sm">
            <div className="flex items-center m-auto w-full max-w-4xl">
                <div className="w-36">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <form onSubmit={handleSearch}>
                    <Input
                        className="px-3 bg-gray-100 rounded-xl border-0"
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </form>
                {loggedIn && (
                    <div className="ml-auto cursor-pointer" onClick={logout}>
                        {user.username}
                    </div>
                )}
            </div>
        </div>
    );
}
