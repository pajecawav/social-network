import { Button } from "../ui/Button";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";
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
            <div className="w-96 mb-4">{children}</div>

            <HorizontalSeparator />

            <div className="mt-4 ml-auto w-max flex gap-4">
                <Button
                    size="thin"
                    color="transparent"
                    onClick={() => props?.onRequestClose()}
                >
                    {cancelText}
                </Button>
                <Button size="thin" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </ModalBase>
    );
}
