import clsx from "clsx";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { formatLastEdited } from "../utils";
import { CircleAvatar } from "./CircleAvatar";

export function ChatMessage({
    message,
    showUser = true,
    isSelected = false,
    isFirstSelected = false,
    isLastSelected = false,
    isSelectable = true,
    onSelect,
    onUnselect,
}) {
    return (
        <div
            className={clsx(
                "flex gap-2 mr-2 px-2 py-1 group transition-colors duration-100",
                isSelectable && "cursor-pointer",
                isSelected && "bg-primary-600",
                // TODO: probably not the best solution
                isFirstSelected && "rounded-t-md",
                isLastSelected && "rounded-b-md"
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
                        <CircleAvatar
                            fileName={message.user.avatar?.fullName}
                        />
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
                            className="ml-1 text-primary-500"
                            title={`edited ${formatLastEdited(
                                message.timeEdited
                            )}`}
                        >
                            (edited)
                        </span>
                    )}
                </div>
            </div>

            {/* <div className="flex items-center self-start float-right w-6 h-8 transition-opacity duration-200 opacity-0 justify-items-center group-hover:opacity-100"> */}
            {/*     {isEditable && ( */}
            {/*         <button */}
            {/*             className="w-4 transition-colors duration-100 cursor-pointer text-primary-500 hover:text-primary-400" */}
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
