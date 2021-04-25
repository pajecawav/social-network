import clsx from "clsx";

export function Container({ className, children }) {
    return (
        <div className={clsx("bg-white rounded shadow-sm border", className)}>
            {children}
        </div>
    );
}
