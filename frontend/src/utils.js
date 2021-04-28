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
