import clsx from "clsx";

export function Input({ className, flat = false, ...props }) {
    return (
        <input
            className={clsx(
                "px-2 py-1 bg-primary-700 placeholder-primary-400 transition-colors duration-100 border-primary-600 rounded outline-none appearance-none font-sm text-primary-200 focus:border-secondary",
                !flat && "border-2",
                className
            )}
            size={1}
            {...props}
        />
    );
}
