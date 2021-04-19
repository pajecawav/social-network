import clsx from "clsx";
import { Avatar } from "./Avatar";

export function CircleAvatar({ className, size = 4, ...props }) {
    return (
        <Avatar
            className={clsx("rounded-full", className)}
            style={{ width: `${size}rem`, height: `${size}rem` }}
            {...props}
        />
    );
}
