import { FormEvent, useContext, useState } from "react";
import { logInGetToken } from "../api";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Container } from "./Container";

type SigninFormProps = {
    username: string;
    error: string;
};

export const SigninForm = ({
    username: usernameProp,
    error: errorProp,
}: SigninFormProps) => {
    const [username, setUsername] = useState(usernameProp || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(errorProp || null);
    const { login } = useContext(UserContext);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        logInGetToken({ username, password })
            .then((response) => {
                login(response.data.accessToken);
            })
            .catch((error) => {
                setError(error.response.data.detail);
            });
    };

    return (
        <Container className="p-4">
            <form
                className="flex flex-col gap-4 max-w-64"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-center">Login to SN</div>
                </div>
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    onChange={setUsername}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={setPassword}
                />
                {error && <FormError text={error} />}
                <Button>Sign In</Button>
            </form>
        </Container>
    );
};
