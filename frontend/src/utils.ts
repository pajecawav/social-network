import dayjs, { Dayjs } from "dayjs";
import { Chat, ChatAction, User } from "./types";

export const getLocalToken = () => localStorage.getItem("token");

export const saveLocalToken = (token: string) =>
    localStorage.setItem("token", token);

export const deleteLocalToken = () => localStorage.removeItem("token");

export const splitLowercaseWords = (str: string) => {
    return str
        .toLocaleLowerCase()
        .split(" ")
        .filter((word) => word);
};

export const buildSearchString = (values: Record<string, string | null>) => {
    const params = new URLSearchParams();
    for (let key in values) {
        const value = values[key];
        if (value !== null) {
            params.set(key, value);
        }
    }
    return params.toString();
};

export const getChatTitle = (chat: Chat) => {
    switch (chat.chatType) {
        case "direct":
            return `${chat.peer.firstName} ${chat.peer.lastName}`;
        case "group":
            return chat.title;
        default:
            throw new Error();
    }
};

export const formatDate = (date: Date | Dayjs) => {
    const date_ = dayjs(date);
    const now = dayjs();

    return date_.format(date_.isSame(now, "year") ? "MMMM D" : "D MMMM, YYYY");
};

export const formatDateOrTime = (date: Date) => {
    const date_ = dayjs(date);
    const now = dayjs();

    if (date_.isSame(now, "day")) {
        return date_.format("HH:mm");
    } else if (date_.isSame(now, "year")) {
        return date_.format("MMMM D");
    } else {
        return date_.format("D MMMM, YYYY");
    }
};

export const formatLastSeen = (date: Date) => {
    const then = dayjs(date);
    const now = dayjs();
    const yesterday = now.subtract(1, "day");
    const diff = now.diff(then, "second");

    if (diff < 60 * 60) {
        return `${Math.floor(diff / 60)} minutes ago`;
    } else if (then.isSame(now, "day")) {
        return then.format("[today at] HH:mm");
    } else if (then.isSame(yesterday, "day")) {
        return then.format("[yesterday at] HH:mm");
    } else if (then.isSame(yesterday, "year")) {
        return then.format("D MMMM [at] HH:mm");
    } else {
        return then.format("D MMMM YYYY");
    }
};

export const formatLastEdited = (date: Date) => {
    const then = dayjs(date);
    const now = dayjs();

    if (then.isSame(now, "day")) {
        return then.format("[today at] HH:mm");
    } else if (then.isSame(now, "year")) {
        return then.format("MMMM D [at] HH:mm");
    } else {
        return then.format("D MMMM, YYYY [at] HH:mm");
    }
};

export const chatActionToText = (user: User, action: ChatAction) => {
    const fromUser = `${user.firstName} ${user.lastName}`;
    const towardsUser =
        "towardsUser" in action && action.towardsUser
            ? `${action.towardsUser.firstName} ${action.towardsUser.lastName}`
            : null;

    switch (action.chatActionType) {
        case "create":
            return `${fromUser} created chat`;
        case "invite":
            return `${fromUser} invited ${towardsUser}`;
        case "leave":
            return `${fromUser} left`;
        case "kick":
            return `${fromUser} kicked ${towardsUser}`;
        case "join":
            return `${fromUser} joined`;
    }
};
