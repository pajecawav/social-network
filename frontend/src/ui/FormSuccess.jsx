import clsx from "clsx";

export function FormSuccess({ className, text }) {
    return (
        <div
            className={clsx(
                "bg-emerald-100 text-gray-900 max-w-full p-2 rounded border-green-700 border",
                className
            )}
        >
            {text}
        </div>
    );
}
