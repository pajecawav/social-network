import clsx from "clsx";

export function SquareAvatar({ className, scale = 2, ...props }) {
    // TODO: use an actual image
    return (
        <div
            className={clsx("overflow-hidden aspect-w-1 aspect-h-1", className)}
        >
            <img
                className="object-cover"
                src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg"
                alt={"user avatar"}
                {...props}
            />
        </div>
    );
}
