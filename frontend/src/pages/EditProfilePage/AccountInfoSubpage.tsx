import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { updateUser } from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../../ui/Button";
import { FormError } from "../../ui/FormError";
import { FormField } from "../../ui/FormField";
import { FormSuccess } from "../../ui/FormSuccess";

export const AccountInfoSubpage = () => {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user!.firstName);
    const [lastName, setLastName] = useState(user!.lastName);
    const [success, setSuccess] = useState<boolean | null>(null);
    const formRef = useRef(null);

    useEffect(() => {
        setSuccess(null);
    }, [firstName, lastName]);

    const handleUpdateAccount = (event: FormEvent) => {
        setSuccess(null);
        const isValidForm = (event.target as HTMLFormElement).reportValidity();
        if (!isValidForm) return;

        event.preventDefault();

        updateUser(user!.userId, { firstName, lastName })
            .then(() => {
                setSuccess(true);
                setUser({ ...user!, firstName, lastName });
            })
            .catch((error) => {
                setSuccess(false);
                console.error(error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 my-4">
            <h2 className="text-xl">Update account info</h2>
            {/* TODO: refactor the form into a reusable component */}
            <form
                className="flex flex-col w-full gap-4 sm:w-auto"
                onSubmit={handleUpdateAccount}
                ref={formRef}
            >
                <div className="grid items-center gap-y-4 gap-x-2 px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]">
                    <FormField
                        id="firstName"
                        label="First name:"
                        type="text"
                        value={firstName}
                        onChange={(value) => setFirstName(value)}
                    />
                    <FormField
                        id="lastName"
                        label="Last name:"
                        type="text"
                        value={lastName}
                        onChange={(value) => setLastName(value)}
                    />
                </div>

                {success !== null && (
                    <div className="w-full mt-4">
                        {success ? (
                            <FormSuccess text="Successfully updated profile." />
                        ) : (
                            <FormError text="Error updating profile." />
                        )}
                    </div>
                )}
                <Button className="mx-auto w-max">Save</Button>
            </form>
        </div>
    );
};
