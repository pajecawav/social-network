import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import ReactModal from "react-modal";

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "0",
        maxWidth: "90%",
        maxHeight: "90%",
        border: "none",
        borderRadius: "0.5rem",
        backgroundColor: "transparent",
    },
    overlay: {
        backgroundColor: "#000000A0",
        zIndex: "1000",
    },
};

export function ModalBase({ title, children, bodyClassName, style, ...props }) {
    const mergedStyle = {
        content: { ...modalStyles.content, ...(style?.content || {}) },
        overlay: { ...modalStyles.overlay, ...(style?.overlay || {}) },
    };

    return (
        <ReactModal
            {...props}
            style={mergedStyle}
            closeTimeoutMS={50}
            ariaHideApp={false}
        >
            <div className="flex items-center px-5 py-2 text-primary-200 bg-primary-800 border-b-2 border-primary-700">
                <div className="text-lg font-medium">{title}</div>
                <XIcon
                    className="h-6 w-6 ml-auto cursor-pointer duration-200 text-primary-300 hover:text-primary-100"
                    onClick={() => props?.onRequestClose?.()}
                />
            </div>

            <div
                className={clsx(
                    "p-5 bg-primary-800 text-primary-200",
                    bodyClassName
                )}
            >
                {children}
            </div>
        </ReactModal>
    );
}
