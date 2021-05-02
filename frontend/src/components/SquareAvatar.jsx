import clsx from "clsx";

export function SquareAvatar({ className, scale = 2, ...props }) {
    // TODO: use an actual image
    return (
        <img
            className={clsx("bg-primary-200", className)}
            style={{ width: `${scale}rem`, height: `${scale}rem` }}
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt={"user avatar"}
            {...props}
        />
    );
}
