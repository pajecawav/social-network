import { SigninForm } from "../components/SigninForm";
import { SignupForm } from "../components/SignupForm";

export function LandingPage() {
    return (
        <div className="flex flex-col gap-4 m-auto mt-4 w-max">
            <SigninForm />
            <SignupForm />
        </div>
    );
}
