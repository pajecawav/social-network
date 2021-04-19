import clsx from "clsx";

export function HorizontalSeparator({ className }) {
    return (
        <div className={clsx("w-full border-b-2 border-gray-100", className)} />
    );
}
