import clsx from "clsx";

const sizeClassnames = {
    normal: "py-2",
    thin: "py-1",
};

export function Button({ className, size = "normal", children, ...props }) {
    return (
        <button
            className={clsx(
                "base-button bg-secondary",
                sizeClassnames[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
