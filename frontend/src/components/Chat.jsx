import dayjs from "dayjs";
import React from "react";
import { formatDate } from "../utils";
import { ChatMessage } from "./ChatMessage";
import { ChatAction } from "./ChatAction";

export function Chat({ messages = [] }) {
    let previousDate = null;

    return messages.map((message, index) => {
        const sentDate = dayjs(message.timeSent);
        const shouldDisplayDate =
            previousDate === null || !sentDate.isSame(previousDate, "day");

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
                        showUser={
                            index === 0 ||
                            shouldDisplayDate ||
                            message.user.userId !==
                                messages[index - 1].user.userId
                        }
                    />
                )}
            </React.Fragment>
        );
    });
}
