import { Button } from "../ui/Button";
import { ModalBase } from "../ui/ModalBase";

export function ConfirmationModal({
    title,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    children,
    ...props
}) {
    return (
        <ModalBase title={title} {...props}>
            <div className="max-w-full pb-4 border-b-2 w-96 border-primary-700">
                {children}
            </div>

            <div className="flex gap-4 mt-4 ml-auto w-max">
                <button
                    className="bg-transparent"
                    size="thin"
                    onClick={() => props?.onRequestClose()}
                >
                    {cancelText}
                </button>
                <Button size="thin" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </ModalBase>
    );
}
