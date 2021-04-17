import axios from "axios";
import { decamelizeKeys } from "humps";
import { getLocalToken } from "./utils";

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
    return axios.post("/api/users", decamelizeKeys(data));
}

export async function getUser(id) {
    return axios.get(`/api/users/${id}`, { headers: getAuthHeaders() });
}
