import clsx from "clsx";

export function FormError({ className, text }) {
    return (
        <div
            className={clsx(
                "bg-red-200 max-w-full p-2 rounded border-red-400 border",
                className
            )}
        >
            {text}
        </div>
    );
}
