import { FormEvent, useContext, useState } from "react";
import { useHistory } from "react-router";
import { logInGetToken, signup } from "../api";
import { Container } from "../components/Container";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";

type SignupFormProps = {
    username: string;
};

export const SignupForm = ({ username: usernameProp }: SignupFormProps) => {
    const [username, setUsername] = useState(usernameProp || "");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        signup({
            firstName,
            lastName,
            username,
            password,
        })
            .then(() => {
                logInGetToken({ username, password }).then((response) => {
                    login(response.data.accessToken);
                    history.push("/");
                });
            })
            .catch((error) => {
                setError(error.response.data.detail);
            });
    };

    return (
        <Container className="p-4">
            <form
                className="flex flex-col w-64 gap-4 max-w-64"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-center">
                        First time here?
                    </div>
                    <div className="text-xs text-center text-primary-500">
                        Sign up for SN
                    </div>
                </div>
                <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    required
                    onChange={setFirstName}
                />
                <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    required
                    onChange={setLastName}
                />
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
                {error !== null && <FormError text={error} />}
                <Button>Sign Up</Button>
            </form>
        </Container>
    );
};
