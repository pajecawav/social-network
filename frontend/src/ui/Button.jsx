import clsx from "clsx";

export function Button({ className, children, ...props }) {
    return (
        <button className={clsx("base-button", className)} {...props}>
            {children}
        </button>
    );
}
