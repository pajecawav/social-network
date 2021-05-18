export function CircleAvatar({ isOnline = null, ...props }) {
    // TODO: use an actual image
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-full aspect-w-1 aspect-h-1">
                <div>
                    <img
                        className="object-cover"
                        src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg"
                        alt={"user avatar"}
                        {...props}
                    />
                </div>
            </div>
            {isOnline && (
                <div className="absolute bottom-[5%] right-[5%] flex w-1/5 rounded-full h-1/5 bg-primary-800">
                    <div className="w-2/3 m-auto bg-green-500 rounded-full h-2/3" />
                </div>
            )}
        </div>
    );
}
