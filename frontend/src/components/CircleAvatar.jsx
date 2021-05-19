import { AvatarPlaceholder } from "./AvatarPlaceholder";

export function CircleAvatar({ src, isOnline = null, ...props }) {
    // TODO: use an actual image
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-full aspect-w-1 aspect-h-1">
                <div>
                    {src ? (
                        <img
                            className="object-cover"
                            // src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg"
                            src={src}
                            alt={"user avatar"}
                            {...props}
                        />
                    ) : (
                        <AvatarPlaceholder />
                    )}
                </div>
            </div>
            {isOnline && (
                <div className="absolute bottom-[2%] right-[2%] flex w-1/4 rounded-full h-1/4 bg-primary-800">
                    <div className="w-2/3 m-auto bg-green-500 rounded-full h-2/3" />
                </div>
            )}
        </div>
    );
}
