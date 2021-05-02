import clsx from "clsx";

export function FormError({ className, text }) {
    return (
        <div
            className={clsx(
                "max-w-full p-2 rounded text-primary-600 bg-error border border-primary-400",
                className
            )}
        >
            {text}
        </div>
    );
}
