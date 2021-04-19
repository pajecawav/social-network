import { useLocation } from "react-router";
import { SigninForm } from "../components/SigninForm";
import { SignupForm } from "../components/SignupForm";

export function LandingPage() {
    const location = useLocation();

    return (
        <div className="flex flex-col gap-4 m-auto mt-4 w-max">
            <SigninForm
                username={location.state?.username}
                error={location.state?.error}
            />
            <SignupForm />
        </div>
    );
}
