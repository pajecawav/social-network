import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { getLocalToken } from "./utils";

export function configureAxios() {
    axios.interceptors.response.use((response) => {
        response.data = camelizeKeys(response.data);
        return response;
    });

    axios.interceptors.request.use((config) => {
        if (!(config.data instanceof URLSearchParams) && config.data) {
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
}

export function getAuthHeaders() {
    const token = getLocalToken();
    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getMe() {
    return axios.get("/api/users/me");
}

export async function logInGetToken(data) {
    return axios.post("/api/login/token", new URLSearchParams(data));
}

export async function signup(data) {
    return axios.post("/api/users", data);
}

export async function getUser(userId) {
    return axios.get(`/api/users/${userId}`);
}

export async function updateUser(userId, data) {
    return axios.patch(`/api/users/${userId}`, data);
}

export async function getUserInfo(userId) {
    return axios.get(`/api/users/${userId}/info`);
}

export async function updateUserInfo(userId, data) {
    return axios.patch(`/api/users/${userId}/info`, data);
}

export async function getUsers({ cursor, query, limit }) {
    return axios.get("/api/users", {
        params: { cursor, query, limit },
    });
}

export async function getFriends(params) {
    return axios.get("/api/friends", {
        params,
    });
}

export async function addFriend(userId) {
    return axios.post("/api/friends", { userId });
}

export async function unfriend(userId) {
    return axios.delete("/api/friends", {
        data: { userId },
    });
}

export async function getChat(chatId) {
    return axios.get(`/api/chats/${chatId}`);
}

export async function getChats() {
    return axios.get("/api/chats");
}

export async function createChat(data) {
    return axios.post("/api/chats", data);
}

export async function addChatUser(chatId, userId) {
    return axios.post(`/api/chats/${chatId}/users`, { userId });
}

export async function removeChatUser(chatId, userId) {
    return axios.delete(`/api/chats/${chatId}/users`, { data: { userId } });
}

export async function getChatUsers(chatId) {
    return axios.get(`/api/chats/${chatId}/users`);
}

export async function getChatMessages(chatId) {
    return axios.get(`/api/chats/${chatId}/messages`);
}

export async function deleteChatMessages(chatId, data) {
    return axios.delete(`/api/chats/${chatId}/messages`, {
        data: data,
    });
}

export async function sendMessage(data) {
    return axios.post("/api/messages", data);
}

export async function deleteMessage(messageId) {
    return axios.delete(`/api/messages/${messageId}`);
}

export async function editMessage(messageId, { text }) {
    return axios.patch(`/api/messages/${messageId}`, { text });
}
