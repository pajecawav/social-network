import { XIcon } from "@heroicons/react/outline";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../ui/Button";

export function MessagesActionsBlock({
    selectedMessages,
    onUnselectAll,
    onEditMessage,
    onDeleteSelectedMessages,
}) {
    const { user } = useContext(UserContext);

    const onlyMyMessagesSelected =
        selectedMessages.findIndex((msg) => msg.user.userId !== user.userId) ===
        -1;

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
                    disabled={
                        selectedMessages.length > 1 || !onlyMyMessagesSelected
                    }
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
                    disabled={!onlyMyMessagesSelected}
                    onClick={onDeleteSelectedMessages}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
