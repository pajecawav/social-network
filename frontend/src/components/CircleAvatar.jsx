import { AvatarPlaceholder } from "./AvatarPlaceholder";

export function CircleAvatar({ fileName, isOnline = null, ...props }) {
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-full aspect-w-1 aspect-h-1">
                <div>
                    {fileName ? (
                        <img
                            className="object-cover h-full"
                            src={`/storage/${fileName}`}
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
