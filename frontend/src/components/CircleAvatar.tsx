import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { Identicon } from "../ui/Identicon";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

type CircleAvatarProps = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
> & {
    fileName?: string | null;
    identiconSeed?: number | null;
    isOnline?: boolean;
};

export const CircleAvatar = ({
    fileName = null,
    identiconSeed = null,
    isOnline = false,
    ...props
}: CircleAvatarProps) => {
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-full aspect-w-1 aspect-h-1">
                {fileName ? (
                    <img
                        className="object-cover"
                        src={`/storage/${fileName}`}
                        alt={"user avatar"}
                        {...props}
                    />
                ) : identiconSeed ? (
                    <Identicon
                        className="p-[20%] bg-primary-600"
                        width={5}
                        height={5}
                        seed={identiconSeed}
                    />
                ) : (
                    <AvatarPlaceholder />
                )}
            </div>
            {isOnline && (
                <div className="absolute bottom-[2%] right-[2%] flex w-1/4 rounded-full h-1/4 bg-primary-800">
                    <div className="w-2/3 m-auto bg-green-500 rounded-full h-2/3" />
                </div>
            )}
        </div>
    );
};
