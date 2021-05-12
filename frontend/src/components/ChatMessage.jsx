import clsx from "clsx";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { CircleAvatar } from "./CircleAvatar";

export function ChatMessage({ message, showUser = true }) {
    return (
        <div className="flex gap-2">
            <div className={clsx("w-10 flex-shrink-0", showUser && "h-10")}>
                {showUser && (
                    <Link className="w-8" to={`/users/${message.user.userId}`}>
                        <CircleAvatar />
                    </Link>
                )}
            </div>

            <div className="flex flex-col">
                {showUser && (
                    <div>
                        <Link
                            className="text-secondary-500 hover:underline"
                            to={`/users/${message.user.userId}`}
                        >
                            {message.user.firstName}
                        </Link>
                        <span className="ml-2 text-xs text-primary-500">
                            {dayjs(message.timeSent).format("HH:mm")}
                        </span>
                    </div>
                )}

                <div>{message.text}</div>
            </div>
        </div>
    );
}
