import clsx from "clsx";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

type AvatarProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
> & {
    fileName?: string;
    className?: string;
};

export const Avatar = ({ fileName, className, ...props }: AvatarProps) => {
    return fileName ? (
        <img
            className={clsx("w-full object-cover", className)}
            src={`/storage/${fileName}`}
            alt={"user avatar"}
            {...props}
        />
    ) : (
        <AvatarPlaceholder />
    );
};
