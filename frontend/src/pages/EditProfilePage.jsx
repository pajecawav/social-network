import { UploadIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { getUserInfo, updateUserAvatar, updateUserInfo } from "../api";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { TabsHeader } from "../components/TabsHeader";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useSearchParams } from "../hooks/useSearchParams";
import { useTitle } from "../hooks/useTitle";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { FormSuccess } from "../ui/FormSuccess";
import { Input } from "../ui/Input";
import { SelectInput } from "../ui/SelectInput";
import { buildSearchString } from "../utils";

const GENDER_VALUES = [
    { value: null, name: "None selected" },
    { value: "male", name: "Male" },
    { value: "female", name: "Female" },
];

const TABS = [
    { tab: "info", title: "User information" },
    { tab: "avatar", title: "Profile picture" },
];

function Label({ text, ...props }) {
    return (
        <label
            className={clsx(
                "self-center block max-w-36 text-primary-500",
                "-mb-2 sm:mb-0 text-justify sm:text-right"
            )}
        >
            {text}
        </label>
    );
}

function FormField({ id, label, ...props }) {
    return (
        <>
            <Label text={label} htmlFor={id} />
            <Input
                id={id}
                {...props}
                className={"w-full sm:w-60 sm:flex-grow"}
            />
        </>
    );
}

function UserInfoTab() {
    const { user } = useContext(UserContext);
    const [userInfo, _setUserInfo] = useState(null);
    const [success, setSuccess] = useState(null);
    const formRef = useRef(null);
    const isSmallScreen = useIsSmallScreen();

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

        let userInfoCopy = { ...userInfo };
        for (let key in userInfoCopy) {
            if (!Boolean(userInfoCopy[key])) {
                userInfoCopy[key] = null;
            }
        }

        updateUserInfo(user.userId, userInfoCopy)
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
                ref={formRef}
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
                        onOptionSelected={(value) =>
                            setUserInfo({ gender: value })
                        }
                    />
                    <FormField
                        id="birthdate"
                        type="date"
                        label="Birthday:"
                        value={userInfo.birthdate || ""}
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
    );
}

function ProfilePictureTab() {
    const { user } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleUpload = () => {
        if (!file) return;

        setError(null);
        updateUserAvatar(user.userId, file)
            .then(() => history.push("/me"))
            // TODO: better error handling
            .catch(console.error);
    };

    return (
        <div className="flex flex-col gap-8 px-8 py-10">
            <div className="m-auto text-2xl text-center">
                Upload new profile picture
            </div>
            <div className="relative flex m-auto w-full min-h-[10rem] py-4 max-w-[36rem] border-2 border-dashed border-primary-500">
                <div className="flex flex-col gap-3 px-12 m-auto text-xl text-primary-400">
                    {file ? (
                        <div className="max-w-full text-center">
                            Selected file{" "}
                            <span className="text-secondary-500">
                                {file.name}
                            </span>
                        </div>
                    ) : (
                        <>
                            <UploadIcon className="w-10 h-10 mx-auto" />
                            <h1 className="text-center">
                                Choose an image or drag it here
                            </h1>
                        </>
                    )}
                </div>
                <input
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    accept="image/jpeg"
                    onChange={(event) => {
                        const file = event.target.files[0];
                        setFile(file);
                        // TODO: refactor this random number into a constant
                        if (file.size > 3 * 1024 * 1024) {
                            setError("File is too big (max size 3Mb)");
                        }
                    }}
                />
            </div>

            <div className="flex flex-col items-center gap-4 m-auto">
                {error && <FormError text={error} />}
                <Button
                    className="w-max"
                    disabled={file === null || error !== null}
                    onClick={handleUpload}
                >
                    Upload
                </Button>
            </div>
        </div>
    );
}

export function EditProfilePage() {
    const { section: selectedTab = "info" } = useSearchParams();
    const history = useHistory();

    useTitle("Edit my profile");

    const changeTab = (tab) => {
        history.push({
            pathname: "/edit",
            search: buildSearchString({ section: tab }),
        });
    };

    let component;
    switch (selectedTab) {
        case "avatar":
            component = <ProfilePictureTab />;
            break;
        case "info":
        default:
            component = <UserInfoTab />;
            break;
    }

    return (
        <Container className="flex flex-col">
            <TabsHeader
                tabs={TABS}
                selectedTab={selectedTab}
                onTabSelected={changeTab}
            />
            {component}
        </Container>
    );
}
