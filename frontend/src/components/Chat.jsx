import dayjs from "dayjs";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { formatDate } from "../utils";
import { ChatAction } from "./ChatAction";
import { ChatMessage } from "./ChatMessage";

export function Chat({ messages = [], activeMessages = [], onEditMessage }) {
    const { user } = useContext(UserContext);
    let previousDate = null;

    return messages.map((message, index) => {
        const previousMessage = messages[index - 1] || null;
        const sentDate = dayjs(message.timeSent);

        const shouldDisplayDate =
            previousDate === null || !sentDate.isSame(previousDate, "day");
        const shouldShowUser =
            index === 0 ||
            shouldDisplayDate ||
            previousMessage.action !== null ||
            message.user.userId !== previousMessage?.user.userId ||
            (previousDate && sentDate.diff(previousDate, "minutes") >= 15);

        previousDate = sentDate;

        return (
            <React.Fragment key={message.messageId}>
                {shouldDisplayDate && (
                    <div className="mx-auto font-sm text-primary-500">
                        {formatDate(sentDate)}
                    </div>
                )}
                {message.action ? (
                    <ChatAction action={message.action} user={message.user} />
                ) : (
                    <ChatMessage
                        message={message}
                        showUser={shouldShowUser}
                        onEditMessage={onEditMessage}
                        isActive={activeMessages.includes(message.messageId)}
                        isEditable={message.user.userId === user.userId}
                    />
                )}
            </React.Fragment>
        );
    });
}
