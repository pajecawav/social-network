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
            <div className="w-96 pb-4 border-b-2 border-primary-700">
                {children}
            </div>

            <div className="mt-4 ml-auto w-max flex gap-4">
                <Button size="thin" onClick={() => props?.onRequestClose()}>
                    {cancelText}
                </Button>
                <Button size="thin" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </ModalBase>
    );
}
