import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { getLocalToken } from "./utils";

export function configureAxios() {
    // TODO: should I those interceptors?

    axios.interceptors.response.use((response) => {
        response.data = camelizeKeys(response.data);
        return response;
    });

    axios.interceptors.request.use((config) => {
        if (!config.data instanceof URLSearchParams) {
            config.data = decamelizeKeys(config.data);
        }
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
    return axios.get("/api/users/me", { headers: getAuthHeaders() });
}

export async function logInGetToken(data) {
    return axios.post("/api/login/token", new URLSearchParams(data));
}

export async function signup(data) {
    return axios.post("/api/users", data);
}

export async function getUser(id) {
    return axios.get(`/api/users/${id}`, { headers: getAuthHeaders() });
}

export async function getUsers({ cursor = null, query = null, limit = null }) {
    return axios.get("/api/users", {
        headers: getAuthHeaders(),
        params: { cursor, query, limit },
    });
}
