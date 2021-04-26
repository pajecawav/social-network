import clsx from "clsx";

const sizeClassnames = {
    normal: "py-2",
    thin: "py-1",
};

const colorClassnames = {
    primary: "text-white bg-purple-500",
    secondary: "text-gray-600 bg-purple-200",
    transparent: "text-gray-600 hover:bg-purple-200",
};

export function Button({
    className,
    size = "normal",
    color = "primary",
    children,
    ...props
}) {
    return (
        <button
            className={clsx(
                "base-button",
                sizeClassnames[size],
                colorClassnames[color],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
