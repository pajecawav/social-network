import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { updatePassword } from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../../ui/Button";
import { FormError } from "../../ui/FormError";
import { FormSuccess } from "../../ui/FormSuccess";
import { FormField } from "./FormField";

export const PasswordSubpage = () => {
    const { user } = useContext(UserContext);
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const repeatNewPasswordRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        (
            repeatNewPasswordRef.current as HTMLFormElement | null
        )?.setCustomValidity("");
    }, [repeatNewPassword]);

    const handleUpdateAccount = (event: FormEvent) => {
        setSuccess(null);
        const isValidForm = (event.target as HTMLFormElement).reportValidity();
        if (!isValidForm) return;

        event.preventDefault();

        if (newPassword !== repeatNewPassword) {
            repeatNewPasswordRef.current?.setCustomValidity(
                "Passwords do not match."
            );
            return;
        }

        updatePassword(user!.userId, { newPassword })
            .then(() => {
                setSuccess(true);
                setNewPassword("");
                setRepeatNewPassword("");
            })
            .catch((error) => {
                setSuccess(false);
                console.error(error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 my-4">
            <h2 className="text-xl">Update account password</h2>
            <form
                className="flex flex-col w-full gap-4 sm:w-auto"
                onSubmit={handleUpdateAccount}
                ref={formRef}
            >
                <div className="grid items-center gap-y-4 gap-x-2 px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]">
                    <FormField
                        id="newPassword"
                        label="New password:"
                        type="password"
                        value={newPassword}
                        required
                        minLength={1}
                        onChange={(value: string) => setNewPassword(value)}
                    />
                    <FormField
                        id="repeatNewPassword"
                        label="Repeat password:"
                        type="password"
                        value={repeatNewPassword}
                        required
                        minLength={1}
                        onChange={(value) => setRepeatNewPassword(value)}
                        ref={repeatNewPasswordRef}
                    />
                </div>

                {success !== null && (
                    <div className="w-full mt-4">
                        {success ? (
                            <FormSuccess text="Successfully updated password." />
                        ) : (
                            <FormError text="Error updating password." />
                        )}
                    </div>
                )}
                <Button className="mx-auto w-max">Save</Button>
            </form>
        </div>
    );
};
