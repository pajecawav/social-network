import { XIcon } from "@heroicons/react/outline";
import ReactModal from "react-modal";

const modalStyles = {
    content: {
        top: "35%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "0",
        maxWidth: "90%",
        border: "none",
        borderRadius: "0.5rem",
        backgroundColor: "transparent",
    },
    overlay: {
        backgroundColor: "#000000A0",
        zIndex: "1000",
    },
};

export function ModalBase({ title, children, ...props }) {
    return (
        <ReactModal
            {...props}
            style={modalStyles}
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

            <div className="p-5 bg-primary-800 text-primary-200">
                {children}
            </div>
        </ReactModal>
    );
}
