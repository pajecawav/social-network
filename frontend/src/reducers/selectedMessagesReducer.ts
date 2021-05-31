import { Message } from "../types";

type State = Message[];

type Action =
    | { type: "reset" }
    | { type: "add_message"; message: Message }
    | { type: "remove_message"; messageId: Message["messageId"] };

export const selectedMessagesReducer = (
    selectedMessages: State,
    action: Action
) => {
    switch (action.type) {
        case "reset":
            return [];
        case "add_message":
            return selectedMessages.findIndex(
                (msg) => msg.messageId === action.message.messageId
            ) === -1
                ? [...selectedMessages, action.message]
                : selectedMessages;
        case "remove_message":
            return selectedMessages.filter(
                (message) => message.messageId !== action.messageId
            );
    }
};
