import clsx from "clsx";

export function Container({ className, children }) {
    return (
        <div
            className={clsx(
                "bg-primary-800 rounded shadow-sm border border-primary-800",
                className
            )}
        >
            {children}
        </div>
    );
}
