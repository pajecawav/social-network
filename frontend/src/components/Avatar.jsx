import clsx from "clsx";

export function Avatar({ className, ...props }) {
    // TODO: implement actual images
    return <div className={clsx("bg-gray-200", className)} {...props} />;
}
