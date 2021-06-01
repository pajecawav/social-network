import clsx from "clsx";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { updateUserAvatar } from "../../api";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../../ui/Button";
import { FileInput } from "../../ui/FileInput";
import { FormError } from "../../ui/FormError";
import { Spinner } from "../../ui/Spinner";

export const ProfilePictureSubpage = () => {
    const { user } = useContext(UserContext);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const history = useHistory();

    const handleUpload = () => {
        if (!file) return;

        setError(null);
        setIsUploading(true);
        updateUserAvatar(user!.userId, file)
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
            <div className="flex m-auto w-full min-h-[10rem] py-4 max-w-[36rem]">
                <FileInput
                    placeholderText="Choose an image or drag it here"
                    file={file}
                    maxSizeMB={3}
                    onFileSelected={(selectedFile) => setFile(selectedFile)}
                    onError={(error) => setError(error)}
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
};
