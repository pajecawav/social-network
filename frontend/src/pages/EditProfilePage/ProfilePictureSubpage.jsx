import { UploadIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { updateUserAvatar } from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../../ui/Button";
import { FormError } from "../../ui/FormError";
import { Spinner } from "../../ui/Spinner";

export function ProfilePictureSubpage() {
    const { user } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const history = useHistory();

    const handleUpload = () => {
        if (!file) return;

        setError(null);
        setIsUploading(true);
        updateUserAvatar(user.userId, file)
            .then(() => {
                setIsUploading(false);
                history.push("/me");
            })
            // TODO: better error handling
            .catch((error) => {
                setIsUploading(false);
                console.error(error);
            });
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
                            <div>Selected file </div>
                            <div className="break-all text-secondary-500">
                                {file.name}
                            </div>
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
                    className="relative flex w-max"
                    disabled={file === null || error !== null}
                    onClick={handleUpload}
                >
                    <div className={clsx(isUploading && "text-transparent")}>
                        Upload
                    </div>
                    {isUploading && (
                        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                            <Spinner className="stroke-current h-4/5 text-primary-800" />
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}
