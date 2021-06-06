import clsx from "clsx";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { getUserInfo, updateUserInfo } from "../../api";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { UserContext } from "../../contexts/UserContext";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { UserInfo } from "../../types";
import { Button } from "../../ui/Button";
import { FormError } from "../../ui/FormError";
import { FormField } from "../../ui/FormField";
import { FormSuccess } from "../../ui/FormSuccess";
import { Label } from "../../ui/Label";
import { SelectInput } from "../../ui/SelectInput";

export const GENDER_VALUES = [
    { value: null, name: "None selected" },
    { value: "male", name: "Male" },
    { value: "female", name: "Female" },
];

export function UserInfoSubpage() {
    const { user } = useContext(UserContext);
    const [userInfo, _setUserInfo] = useState<UserInfo | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const isSmallScreen = useIsSmallScreen();

    const setUserInfo = (obj: Partial<UserInfo>) => {
        _setUserInfo({ ...userInfo, ...obj });
    };

    useEffect(() => {
        getUserInfo(user!.userId)
            .then((response) => _setUserInfo(response.data))
            .catch(console.error);
        // eslint-disable-next-line
    }, [user!.userId]);

    useEffect(() => {
        setSuccess(null);
    }, [userInfo]);

    const handleUpdateUserInfo = (event: FormEvent) => {
        setSuccess(null);
        const isValidForm = (event.target as HTMLFormElement).reportValidity();
        if (!isValidForm) return;

        event.preventDefault();

        let userInfoCopy = { ...userInfo };
        for (let key in userInfoCopy) {
            if (!Boolean(userInfoCopy[key as keyof UserInfo])) {
                if (key === "gender") {
                    userInfoCopy[key] = null;
                } else {
                    delete userInfoCopy[key as keyof UserInfo];
                }
            }
        }

        updateUserInfo(user!.userId, userInfoCopy)
            .then(() => {
                setSuccess(true);
            })
            .catch((error) => {
                setSuccess(false);
                console.error(error);
            });
    };

    if (isSmallScreen && success === true) {
        return <Redirect to="/me" />;
    }

    return userInfo === null ? (
        <LoadingPlaceholder className="h-full h-30" />
    ) : (
        <div className="flex flex-col items-center justify-center">
            <form
                className="flex flex-col w-full sm:w-auto "
                onSubmit={handleUpdateUserInfo}
            >
                <div
                    className={clsx(
                        "grid items-center gap-y-4 gap-x-2 mt-6",
                        "px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]"
                    )}
                >
                    <Label text="Gender:" />
                    <SelectInput
                        className="w-full sm:w-60 sm:flex-grow"
                        selectedValue={userInfo.gender || null}
                        options={GENDER_VALUES}
                        onOptionSelected={(value: any) =>
                            setUserInfo({ gender: value })
                        }
                    />
                    <FormField
                        id="birthdate"
                        type="date"
                        label="Birthday:"
                        value={userInfo.birthdate as any}
                        min="1900-01-01"
                        max="2020-01-01"
                        onChange={(value: any) =>
                            setUserInfo({ birthdate: value })
                        }
                    />
                    <FormField
                        id="relationshipStatus"
                        type="text"
                        label="Relationship:"
                        value={userInfo.relationshipStatus || ""}
                        onChange={(value) =>
                            setUserInfo({ relationshipStatus: value })
                        }
                    />
                    <FormField
                        id="country"
                        type="text"
                        label="Country:"
                        value={userInfo.country || ""}
                        onChange={(value) => setUserInfo({ country: value })}
                    />
                    <FormField
                        id="city"
                        type="text"
                        label="City:"
                        value={userInfo.city || ""}
                        onChange={(value) => setUserInfo({ city: value })}
                    />
                    <FormField
                        id="website"
                        type="url"
                        label="Website:"
                        value={userInfo.website || ""}
                        onChange={(value) => setUserInfo({ website: value })}
                    />
                    <FormField
                        id="email"
                        type="email"
                        label="Email:"
                        value={userInfo.email || ""}
                        onChange={(value) => setUserInfo({ email: value })}
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
    );
}
