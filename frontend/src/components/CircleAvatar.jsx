export function CircleAvatar({ isOnline = null, ...props }) {
    // TODO: use an actual image
    return (
        <div className="relative">
            <div className="rounded-full overflow-hidden aspect-w-1 aspect-h-1">
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
                <div className="absolute right-0 bottom-0 w-4 h-4 rounded-full border-4 border-primary-800 bg-green-500" />
            )}
        </div>
    );
}
