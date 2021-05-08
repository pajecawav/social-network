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

export const formatLastSeen = (date) => {
    const then = dayjs(date);
    const now = dayjs();
    const yesterday = now.subtract(1, "day");
    const diff = now.diff(then, "second");

    if (diff < 60 * 60) {
        return `${Math.floor(diff / 60)} minutes ago`;
    } else if (then.isSame(now, "day")) {
        return `today at ${then.format("h:m")}`;
    } else if (then.isSame(yesterday, "day")) {
        return `yesterday at ${then.format("h:m")}`;
    } else {
        return then.format("D MMMM [at] h:m");
    }
};
