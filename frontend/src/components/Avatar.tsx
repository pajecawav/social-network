import clsx from "clsx";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { Identicon } from "../ui/Identicon";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

type AvatarProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
> & {
    fileName?: string;
    identiconSeed?: number;
    className?: string;
};

export const Avatar = ({
    fileName,
    identiconSeed,
    className,
    ...props
}: AvatarProps) => {
    return fileName ? (
        <img
            className={clsx("w-full object-cover", className)}
            src={`/storage/${fileName}`}
            alt={"user avatar"}
            {...props}
        />
    ) : identiconSeed ? (
        <div className="aspect-w-1 aspect-h-1">
            <Identicon
                className="p-[10%] bg-primary-600"
                width={5}
                height={5}
                seed={identiconSeed}
            />
        </div>
    ) : (
        <AvatarPlaceholder />
    );
};
