import clsx from "clsx";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

export function Avatar({ fileName, className, ...props }) {
    return fileName ? (
        <img
            className={clsx("object-cover", className)}
            src={`/storage/${fileName}`}
            alt={"user avatar"}
            {...props}
        />
    ) : (
        <AvatarPlaceholder />
    );
}
