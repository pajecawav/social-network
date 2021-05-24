import { ChevronDownIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import { formatDate } from "../utils";
import { ChatAction } from "./ChatAction";
import { ChatMessage } from "./ChatMessage";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

export function Chat({
    isLoading,
    messages = [],
    selectedMessages = [],
    onSelectMessage,
    onUnselectMessage,
}) {
    const [isScrollAnchored, setIsScrollAnchored] = useState(true);
    const messagesEnd = useRef(null);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [isLoading]);

    useEffect(() => {
        if (isScrollAnchored) {
            scrollToBottom();
        }
        // eslint-disable-next-line
    }, [messages]);

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView();
    };

    const isSomeMessageSelected = (messageId) =>
        selectedMessages.findIndex((msg) => msg.messageId === messageId) !== -1;

    let previousDate = null;
    const renderedMessages = messages.map((message, index) => {
        const previousMessage = messages[index - 1] || null;
        const nextMessage = messages[index + 1] || null;
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

        const isSelected = isSomeMessageSelected(message.messageId);
        const isFirstSelected =
            isSelected && !isSomeMessageSelected(previousMessage.messageId);
        const isLastSelected =
            isSelected &&
            (nextMessage === null ||
                !isSomeMessageSelected(nextMessage.messageId));

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
                        onSelect={onSelectMessage}
                        onUnselect={onUnselectMessage}
                        isSelected={isSelected}
                        isFirstSelected={isFirstSelected}
                        isLastSelected={isLastSelected}
                        // TODO: disable selection while editing message
                        isSelectable={true}
                    />
                )}
            </React.Fragment>
        );
    });

    return (
        <div className="relative">
            <div className="flex flex-col pt-4 pr-2 ml-4 overflow-y-auto max-h-80">
                {isLoading && <LoadingPlaceholder />}
                {renderedMessages}

                <Waypoint
                    bottomOffset={-50}
                    onEnter={() => setIsScrollAnchored(true)}
                    onLeave={() => setIsScrollAnchored(false)}
                >
                    <div className="pb-4" ref={messagesEnd} />
                </Waypoint>

                <button
                    className={clsx(
                        "absolute z-20 w-10 h-10 ml-auto right-7 bottom-3 p-1 rounded-full border text-secondary-800 bg-primary-700 border-primary-600 transform-colors duration-200 outline-none focus:outline-none hover:bg-primary-600",
                        isScrollAnchored
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100 pointer-events-auto"
                    )}
                    onClick={scrollToBottom}
                >
                    <ChevronDownIcon />
                </button>
            </div>
        </div>
    );
}
