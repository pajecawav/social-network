import clsx from "clsx";
import { useContext, useState } from "react";
import { updateGroupChatAvatar } from "../../api";
import { ModalBase, ModalBaseProps } from "../../components/ModalBase";
import { ChatContext } from "../../contexts/ChatContext";
import { Button } from "../../ui/Button";
import { FileInput } from "../../ui/FileInput";
import { FormError } from "../../ui/FormError";
import { Spinner } from "../../ui/Spinner";

type UpdateGroupChatAvatarModalProps = Omit<ModalBaseProps, "title"> & {
    onRequestClose: () => void;
};

export const UpdateGroupChatAvatarModal = ({
    onRequestClose,
    ...props
}: UpdateGroupChatAvatarModalProps) => {
    const { chat } = useContext(ChatContext);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        if (!file || !chat) return;

        setError(null);
        setIsUploading(true);
        updateGroupChatAvatar(chat.chatId, file)
            .then(() => {
                setIsUploading(false);
                setFile(null);
                onRequestClose();
            })
            // TODO: better error handling
            .catch((error) => {
                setIsUploading(false);
                console.error(error);
            });
    };

    return (
        <ModalBase
            title="Update chat avatar"
            onRequestClose={() => {
                onRequestClose();
            }}
            {...props}
        >
            <div className="flex flex-col gap-4 px-2 py-2">
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
                        <div
                            className={clsx(isUploading && "text-transparent")}
                        >
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
        </ModalBase>
    );
};
