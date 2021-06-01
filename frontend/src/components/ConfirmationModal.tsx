import { PropsWithChildren } from "react";
import { Button } from "../ui/Button";
import { ModalBase, ModalBaseProps } from "./ModalBase";

export type ConfirmationModalProps = Omit<ModalBaseProps, "onRequestClose"> &
    PropsWithChildren<{
        title: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm: () => void;
        onRequestClose: () => void;
    }>;

export const ConfirmationModal = ({
    title,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onRequestClose,
    children,
    ...props
}: ConfirmationModalProps) => (
    <ModalBase title={title} onRequestClose={onRequestClose} {...props}>
        <div className="max-w-full pb-4 border-b-2 w-96 border-primary-700">
            {children}
        </div>

        <div className="flex gap-4 mt-4 ml-auto w-max">
            <button className="bg-transparent" onClick={onRequestClose}>
                {cancelText}
            </button>
            <Button size="thin" onClick={onConfirm}>
                {confirmText}
            </Button>
        </div>
    </ModalBase>
);
