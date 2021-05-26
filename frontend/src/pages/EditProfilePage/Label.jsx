import clsx from "clsx";

export function Label({ text }) {
    return (
        <label
            className={clsx(
                "self-center block max-w-36 text-primary-500",
                "-mb-2 sm:mb-0 text-justify sm:text-right"
            )}
        >
            {text}
        </label>
    );
}
