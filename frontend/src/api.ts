import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Group, User, UserInfo } from "./types";
import { getLocalToken } from "./utils";

export const configureAxios = () => {
    axios.interceptors.response.use((response) => {
        response.data = camelizeKeys(response.data);
        return response;
    });

    axios.interceptors.request.use((config) => {
        if (
            !(config.data instanceof URLSearchParams) &&
            !(config.data instanceof FormData) &&
            config.data
        ) {
            config.data = decamelizeKeys(config.data);
        }

        if (config.params) {
            config.params = decamelizeKeys(config.params);
        }

        return config;
    });

    axios.interceptors.request.use((config) => {
        const token = getLocalToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
};

export const getAuthHeaders = (): { Authorization: string } => {
    const token = getLocalToken();
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getMe = () => axios.get("/api/users/me");

export const logInGetToken = (data: { username: string; password: string }) =>
    axios.post("/api/login/token", new URLSearchParams(data));

export const signup = (data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}) => axios.post("/api/users", data);

export const getUser = (userId: number) => axios.get(`/api/users/${userId}`);

export const updateUser = (
    userId: number,
    data: Partial<Pick<User, "firstName" | "lastName">>
) => axios.patch(`/api/users/${userId}`, data);

export const updatePassword = (userId: number, data: { newPassword: string }) =>
    axios.post(`/api/users/${userId}/password`, data);

export const getUserInfo = (userId: number) =>
    axios.get(`/api/users/${userId}/info`);

export const updateUserInfo = (
    userId: number,
    data: Partial<Omit<UserInfo, "status">> & {
        status?: string | null;
    }
) => axios.patch(`/api/users/${userId}/info`, data);

export const updateUserAvatar = (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/api/users/${userId}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getUsers = (params?: {
    cursor?: number | null;
    limit?: number | null;
    query?: string | null;
}) =>
    axios.get("/api/users", {
        params,
    });

export const getFriends = (params?: {
    userId?: number;
    cursor?: number;
    limit?: number;
    orderBy?: "ids" | "random";
}) =>
    axios.get("/api/friends", {
        params,
    });

export const sendOrAcceptFriendRequest = (userId: number) =>
    axios.post("/api/friends", { userId });

export const getFriendRequests = (params: { incoming?: boolean }) =>
    axios.get("/api/friends/requests", {
        params,
    });

export const getRecommendedFriends = (params: { limit?: number }) =>
    axios.get("/api/friends/recommended", {
        params,
    });

// TODO: better name
export const unfriend = (userId: number) =>
    axios.delete("/api/friends", {
        data: { userId },
    });

export const getChat = (chatId: number) => axios.get(`/api/chats/${chatId}`);

export const getChats = () => axios.get("/api/chats");

export const createChat = (data: { title: string }) =>
    axios.post("/api/chats", data);

export const addChatUser = (chatId: number, userId: number) =>
    axios.post(`/api/chats/${chatId}/users`, { userId });

export const removeChatUser = (chatId: number, userId: number) =>
    axios.delete(`/api/chats/${chatId}/users`, { data: { userId } });

export const getChatUsers = (chatId: number) =>
    axios.get(`/api/chats/${chatId}/users`);

export const getChatMessages = (chatId: number) =>
    axios.get(`/api/chats/${chatId}/messages`);

export const getChatInviteCode = (
    chatId: number,
    params?: { reset?: boolean }
) => axios.get(`/api/chats/${chatId}/invite_code`, { params });

export const joinChatByCode = (inviteCode: string) =>
    axios.post("/api/chats/join", { inviteCode });

export const deleteChatMessages = (
    chatId: number,
    data: { messageIds: number[] }
) =>
    axios.delete(`/api/chats/${chatId}/messages`, {
        data: data,
    });

export const updateGroupChatAvatar = (chatId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/api/chats/${chatId}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const sendMessage = (data: {
    userId: number;
    message: { text: string };
}) => axios.post("/api/messages", data);

export const deleteMessage = (messageId: number) =>
    axios.delete(`/api/messages/${messageId}`);

export const editMessage = (messageId: number, data: { text: string }) =>
    axios.patch(`/api/messages/${messageId}`, data);

export const createGroup = (data: {
    name: string;
    shortDescription?: string;
    description?: string;
}) => axios.post("/api/groups", data);

export const updateGroup = (
    groupId: number,
    data: Partial<Pick<Group, "name" | "shortDescription" | "description">>
) => axios.patch(`/api/groups/${groupId}`, data);

export const getGroup = (groupId: number | string) =>
    axios.get(`/api/groups/${groupId}`);

export const getGroups = (params: {
    query?: string | null;
    limit?: number | null;
    cursor?: number | null;
}) => axios.get("/api/groups", { params });

export const getUsersGroups = (userId: number | string) =>
    axios.get(`/api/users/${userId}/groups`);

export const getGroupUsers = (groupId: number | string) =>
    axios.get(`/api/groups/${groupId}/users`);

export const followGroup = (
    userId: number | string,
    groupId: number | string
) => axios.post(`/api/users/${userId}/groups`, { groupId });

export const unfollowGroup = (
    userId: number | string,
    groupId: number | string
) => axios.delete(`/api/users/${userId}/groups`, { data: { groupId } });
