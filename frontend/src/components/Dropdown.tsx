import clsx from "clsx";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

const closeTimeoutMS = 100;

export type DropdownProps = PropsWithChildren<{
    isOpen: boolean;
    onRequestClose: () => void;
    closeOnClick?: boolean;
    className?: string;
}>;

export const Dropdown = ({
    isOpen,
    onRequestClose,
    closeOnClick = false,
    className,
    children,
}: DropdownProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen || !ref.current) {
            return;
        }

        const handler = (event: MouseEvent) => {
            if (!closeOnClick && ref.current?.contains(event.target as Node)) {
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
};
