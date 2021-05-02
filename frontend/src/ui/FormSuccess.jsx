import clsx from "clsx";

export function FormSuccess({ className, text }) {
    return (
        <div
            className={clsx(
                "bg-success text-primary-900 max-w-full p-2 rounded border-primary-700 border",
                className
            )}
        >
            {text}
        </div>
    );
}
