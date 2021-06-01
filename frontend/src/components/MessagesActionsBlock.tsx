import { XIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Message } from "../types";
import { Button } from "../ui/Button";

type MessagesActionsBlockProps = {
    selectedMessages: Message[];
    onUnselectAll: () => void;
    onEditMessage: (message: Message) => void;
    onDeleteSelectedMessages: () => void;
};

export const MessagesActionsBlock = ({
    selectedMessages,
    onUnselectAll,
    onEditMessage,
    onDeleteSelectedMessages,
}: MessagesActionsBlockProps) => {
    const { user } = useContext(UserContext);

    const onlyMyMessagesSelected =
        selectedMessages.findIndex(
            (msg) => msg.user.userId !== user!.userId
        ) === -1;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex text-primary-400">
                <div>Selected {selectedMessages.length} messages</div>
                <div className="flex items-center justify-center w-8 ml-auto">
                    <XIcon
                        className="inline w-6 transition-colors duration-100 cursor-pointer text-primary-500 hover:text-primary-400"
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
};
