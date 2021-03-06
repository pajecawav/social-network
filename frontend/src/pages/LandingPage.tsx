import { useLocation } from "react-router";
import { SigninForm } from "../components/SigninForm";
import { SignupForm } from "../components/SignupForm";
import { useTitle } from "../hooks/useTitle";

export const LandingPage = () => {
    const location =
        useLocation<{
            username: string;
            error: string;
            signupUsername: string;
        }>();

    useTitle("Welcome! | SN");

    return (
        <div className="flex flex-col gap-4 m-auto mt-4 w-max">
            <SigninForm
                username={location.state?.username}
                error={location.state?.error}
            />
            <SignupForm username={location.state?.signupUsername} />
        </div>
    );
};
