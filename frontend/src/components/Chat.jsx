import dayjs from "dayjs";
import React from "react";
import { ChatMessage } from "./ChatMessage";

export function Chat({ messages = [] }) {
    const now = dayjs();
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
                        {sentDate.format(
                            now.year() === sentDate.year()
                                ? "MMMM D"
                                : "D MMMM, YYYY"
                        )}
                    </div>
                )}
                <ChatMessage
                    message={message}
                    showUser={
                        index === 0 ||
                        shouldDisplayDate ||
                        message.user.userId !== messages[index - 1].user.userId
                    }
                />
            </React.Fragment>
        );
    });
}
