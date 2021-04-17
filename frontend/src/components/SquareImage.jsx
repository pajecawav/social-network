import clsx from "clsx";

export function SquareImage({ className }) {
    // TODO: use an actual image
    return <div className={clsx("w-24 h-24 bg-purple-200", className)}></div>;
}
