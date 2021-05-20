import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const closeTimeoutMS = 100;

export function Dropdown({
    isOpen,
    onRequestClose,
    closeOnClick = false,
    className,
    children,
}) {
    const [isClosing, setIsClosing] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!isOpen || !ref.current) {
            return;
        }

        const handler = (event) => {
            if (!closeOnClick && ref.current?.contains(event.target)) {
                return;
            }

            const close = () => {
                onRequestClose?.();
                setIsClosing(false);
            };
            setIsClosing(true);
            setTimeout(close, closeTimeoutMS);
        };

        document.body.addEventListener("click", handler);
        return () => document.body.removeEventListener("click", handler);
    }, [isOpen, onRequestClose, closeOnClick]);

    return (
        <div
            className={clsx(
                "absolute z-50 transition-opacity duration-100",
                isOpen && !isClosing ? "opacity-100" : "opacity-0",
                className
            )}
            ref={ref}
        >
            {isOpen && children}
        </div>
    );
}
