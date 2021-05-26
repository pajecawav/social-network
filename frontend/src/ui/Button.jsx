import clsx from "clsx";

const sizeClassnames = {
    normal: "py-2",
    thin: "py-1",
};

export function Button({ className, size = "normal", children, ...props }) {
    return (
        <button
            className={clsx(
                "px-6 py-2 transition-all duration-200 rounded hover:bg-opacity-90 disabled:cursor-auto bg-secondary disabled:bg-primary-600",
                sizeClassnames[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
