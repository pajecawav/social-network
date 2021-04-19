import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { logInGetToken } from "../api";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function SidebarForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { login } = useContext(UserContext);

    const navigateLandingPage = () => {
        history.push("/login");
    };

    const handleLogin = (event) => {
        event.preventDefault();

        logInGetToken({ username, password })
            .then((response) => {
                login(response.data.accessToken, username);
            })
            .catch((error) => {
                history.push({
                    pathname: "/login",
                    state: {
                        username,
                        error: error.response.data.detail,
                    },
                });
            });
    };

    return (
        <form className="flex flex-col gap-4 max-w-64" onSubmit={handleLogin}>
            <Input
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(event) => setUsername(event.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="py-1">Sign In</Button>
            <Button className="py-1" onClick={navigateLandingPage}>
                Sign Up
            </Button>
        </form>
    );
}
