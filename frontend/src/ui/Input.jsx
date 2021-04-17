import clsx from "clsx";

export function Input({ className, ...props }) {
    return (
        <input
            className={clsx(
                "px-2 py-1 placeholder-gray-400 transition-colors duration-100 border border-gray-300 rounded outline-none appearance-none font-sm text-gray-darker focus:border-purple-500;",
                className
            )}
            {...props}
        />
    );
}
