import { XIcon } from "@heroicons/react/outline";
import React from "react";
import { Button } from "../ui/Button";

export function MessagesActionsBlock({
    selectedMessages,
    onUnselectAll,
    onEditMessage,
    onDeleteSelectedMessages,
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex text-primary-400">
                <div>Selected {selectedMessages.length} messages</div>
                <div className="flex w-8 ml-auto items-center justify-center">
                    <XIcon
                        className="inline w-6 text-primary-500 cursor-pointer transition-colors duration-100 hover:text-primary-400"
                        onClick={onUnselectAll}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    disabled={selectedMessages.length > 1}
                    onClick={() => onEditMessage(selectedMessages[0])}
                >
                    Edit
                </Button>
                {/* TODO: implement replies */}
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    disabled={true}
                >
                    Reply
                </Button>
                <Button
                    className="w-max disabled:bg-primary-700"
                    size="thin"
                    onClick={onDeleteSelectedMessages}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
