import clsx from "clsx";

export function Avatar({ className, ...props }) {
    // TODO: use an actual image
    return (
        <img
            className={clsx("object-cover", className)}
            src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg"
            alt={"user avatar"}
            {...props}
        />
    );
}
