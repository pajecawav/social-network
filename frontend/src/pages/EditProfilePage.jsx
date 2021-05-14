import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { getUserInfo, updateUserInfo } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { FormSuccess } from "../ui/FormSuccess";
import { Input } from "../ui/Input";

function FormField({ id, label, ...props }) {
    return (
        <>
            <label
                className={clsx(
                    "self-center block max-w-36 text-primary-500",
                    "-mb-2 sm:mb-0 text-justify sm:text-right"
                )}
                htmlFor={id}
            >
                {label}
            </label>
            <Input
                id={id}
                {...props}
                className={"w-full sm:w-60 sm:flex-grow invalid:border-error"}
            />
        </>
    );
}

export function EditProfilePage() {
    const { user, setUser } = useContext(UserContext);
    const [userInfo, _setUserInfo] = useState(null);
    const [success, setSuccess] = useState(null);
    const formRef = useRef(null);
    const isSmallScreen = useIsSmallScreen();

    useTitle("Edit my profile");

    const setUserInfo = (obj) => {
        _setUserInfo({ ...userInfo, ...obj });
    };

    useEffect(() => {
        getUserInfo(user.userId)
            .then((response) => _setUserInfo(response.data))
            .catch(console.error);
        // eslint-disable-next-line
    }, [user.userId]);

    const handleUpdateUserInfo = (event) => {
        setSuccess(null);
        const isValidForm = event.target.reportValidity();
        if (!isValidForm) return;

        event.preventDefault();

        for (let key in userInfo) {
            if (!Boolean(userInfo[key])) {
                delete userInfo[key];
            }
        }

        updateUserInfo(user.userId, userInfo)
            .then((response) => {
                setSuccess(true);
                setUser({ ...user, ...response.data });
            })
            .catch((error) => {
                setSuccess(false);
                console.error(error);
            });
    };

    if (isSmallScreen && success === true) {
        return <Redirect to="/me" />;
    }

    return (
        <Container className="flex flex-col">
            <HeaderWithCount title="User information" />

            {userInfo === null ? (
                <LoadingPlaceholder className="h-full h-30" />
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <form
                        className="flex flex-col w-full sm:w-auto "
                        onSubmit={handleUpdateUserInfo}
                        ref={formRef}
                    >
                        <div
                            className={clsx(
                                "grid items-center gap-y-4 gap-x-2 mt-6",
                                "px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]"
                            )}
                        >
                            <FormField
                                id="gender"
                                type="text"
                                label="Gender:"
                                value={userInfo.gender || ""}
                                onChange={(event) =>
                                    setUserInfo({ gender: event.target.value })
                                }
                            />
                            <FormField
                                id="birthdate"
                                type="date"
                                label="Birthday:"
                                value={userInfo.birthdate}
                                min="1900-01-01"
                                max="2020-01-01"
                                onChange={(event) =>
                                    setUserInfo({
                                        birthdate: event.target.value,
                                    })
                                }
                            />
                            <FormField
                                id="relationshipStatus"
                                type="text"
                                label="Relationship:"
                                value={userInfo.relationshipStatus || ""}
                                onChange={(event) =>
                                    setUserInfo({
                                        relationshipStatus: event.target.value,
                                    })
                                }
                            />
                            <FormField
                                id="country"
                                type="text"
                                label="Country:"
                                value={userInfo.country || ""}
                                onChange={(event) =>
                                    setUserInfo({
                                        country: event.target.value,
                                    })
                                }
                            />
                            <FormField
                                id="city"
                                type="text"
                                label="City:"
                                value={userInfo.city || ""}
                                onChange={(event) =>
                                    setUserInfo({
                                        city: event.target.value,
                                    })
                                }
                            />
                            <FormField
                                id="website"
                                type="url"
                                label="Website:"
                                value={userInfo.website || ""}
                                onChange={(event) =>
                                    setUserInfo({
                                        website: event.target.value,
                                    })
                                }
                            />
                            <FormField
                                id="email"
                                type="email"
                                label="Email:"
                                value={userInfo.email || ""}
                                onChange={(event) =>
                                    setUserInfo({
                                        email: event.target.value,
                                    })
                                }
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
                        <Button className="mx-auto my-4 w-max">Save</Button>
                    </form>
                </div>
            )}
        </Container>
    );
}
