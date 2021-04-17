import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { logInGetToken } from "../api";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Container } from "./Container";

export function SigninForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);

        logInGetToken({ username, password })
            .then((response) => {
                login(response.data.access_token, username);
                history.push("/");
            })
            .catch((error) => setError(error.response.data.detail));
    };

    return (
        <Container>
            <form
                className="flex flex-col w-64 gap-4 max-w-64"
                onSubmit={handleSubmit}
            >
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
                {error && <FormError text={error} />}
                <Button>Sign In</Button>
            </form>
        </Container>
    );
}
