import { PencilIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { formatLastEdited } from "../utils";
import { CircleAvatar } from "./CircleAvatar";

export function ChatMessage({
    message,
    showUser = true,
    isSelected = false,
    isSelectable = true,
    onSelect,
    onUnselect,
}) {
    return (
        <div
            className={clsx(
                "flex gap-2 mr-2 px-2 py-1 group",
                isSelectable && "cursor-pointer",
                isSelected && "bg-primary-600"
            )}
            id={`message_${message.messageId}`}
            onClick={() => {
                if (!isSelectable) return;
                if (isSelected) {
                    onUnselect(message);
                } else {
                    onSelect(message);
                }
            }}
        >
            <div className={clsx("w-10 flex-shrink-0", showUser && "h-10")}>
                {showUser && (
                    <Link
                        className="flex-shrink-0 w-8"
                        to={`/users/${message.user.userId}`}
                    >
                        <CircleAvatar />
                    </Link>
                )}
            </div>

            <div className="flex flex-col w-full mr-6">
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

                <div>
                    <span>{message.text}</span>
                    {message.timeEdited && (
                        <span
                            className="text-primary-500 ml-1"
                            title={`edited ${formatLastEdited(
                                message.timeEdited
                            )}`}
                        >
                            (edited)
                        </span>
                    )}
                </div>
            </div>

            {/* <div className="flex w-6 h-8 items-center justify-items-center self-start float-right transition-opacity duration-200 opacity-0 group-hover:opacity-100"> */}
            {/*     {isEditable && ( */}
            {/*         <button */}
            {/*             className="w-4 cursor-pointer text-primary-500 hover:text-primary-400 transition-colors duration-100" */}
            {/*             title="Edit" */}
            {/*             onClick={() => onSelectMessage(message)} */}
            {/*         > */}
            {/*             <PencilIcon /> */}
            {/*         </button> */}
            {/*     )} */}
            {/* </div> */}
        </div>
    );
}
