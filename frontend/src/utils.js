import dayjs from "dayjs";

export const getLocalToken = () => localStorage.getItem("token");

export const saveLocalToken = (token) => localStorage.setItem("token", token);

export const deleteLocalToken = () => localStorage.removeItem("token");

export const splitLowercaseWords = (str) => {
    return str
        .toLocaleLowerCase()
        .split(" ")
        .filter((word) => word);
};

export const getChatTitle = (chat) => {
    switch (chat.chatType) {
        case "direct":
            return `${chat.peer.firstName} ${chat.peer.lastName}`;
        case "group":
            return chat.title;
        default:
            throw new Error();
    }
};

export const formatDate = (date) => {
    const date_ = dayjs(date);
    const now = dayjs();

    return date_.format(date_.isSame(now, "year") ? "MMMM D" : "D MMMM, YYYY");
};

export const formatDateOrTime = (date) => {
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

export const formatLastSeen = (date) => {
    const then = dayjs(date);
    const now = dayjs();
    const yesterday = now.subtract(1, "day");
    const diff = now.diff(then, "second");

    if (diff < 60 * 60) {
        return `${Math.floor(diff / 60)} minutes ago`;
    } else if (then.isSame(now, "day")) {
        return `today at ${then.format("HH:mm")}`;
    } else if (then.isSame(yesterday, "day")) {
        return `yesterday at ${then.format("HH:mm")}`;
    } else {
        return then.format("D MMMM [at] HH:mm");
    }
};
