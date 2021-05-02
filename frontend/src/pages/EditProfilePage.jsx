import { useContext, useState } from "react";
import { updateUser } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { UserContext } from "../contexts/UserContext";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { FormSuccess } from "../ui/FormSuccess";
import { Input } from "../ui/Input";

export function EditProfilePage() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [birthdate, setBirthdate] = useState(user?.birthdate || new Date());
    const [success, setSuccess] = useState(null);

    useTitle("Edit my profile");

    const updateUserProfile = (event) => {
        event.preventDefault();
        setSuccess(null);

        updateUser(user.userId, { firstName, lastName, birthdate })
            .then((response) => {
                setSuccess(true);
                setUser({ ...user, ...response.data });
            })
            .catch((error) => {
                setSuccess(false);
                console.error(error);
            });
    };

    return (
        <Container className="flex flex-col">
            <HeaderWithCount title="Basic info" />

            <form
                className="flex flex-col gap-4 mx-auto mt-6"
                onSubmit={updateUserProfile}
            >
                {success !== null &&
                    (success ? (
                        <FormSuccess text="Successfully updated profile." />
                    ) : (
                        <FormError text="Error updating profile." />
                    ))}

                <div className="flex items-center">
                    <label
                        className="block mr-2 w-24 text-right text-primary-500"
                        htmlFor="firstName"
                    >
                        First name:
                    </label>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        required
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <label
                        className="block mr-2 w-24 text-right text-primary-500"
                        htmlFor="lastName"
                    >
                        Last name:
                    </label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        required
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <label
                        className="block mr-2 w-24 text-right text-primary-500"
                        htmlFor="birthdate"
                    >
                        Birthday:
                    </label>
                    <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        required
                        min="1900-01-01"
                        max="2020-01-01"
                        onChange={(event) => setBirthdate(event.target.value)}
                    />
                </div>

                <Button className="mx-auto mb-4 w-max">Save</Button>
            </form>
        </Container>
    );
}
