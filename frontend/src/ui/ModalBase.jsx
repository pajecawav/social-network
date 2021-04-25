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
            <div className="flex items-center px-5 py-2 border-b-2 text-gray-200 bg-purple-500">
                <div className="text-lg font-medium">{title}</div>
                <XIcon
                    className="h-6 w-6 ml-auto cursor-pointer duration-200 text-gray-300 hover:text-gray-100"
                    onClick={() => props?.onRequestClose?.()}
                />
            </div>

            <div className="p-5 bg-white">{children}</div>
        </ReactModal>
    );
}
