import axios from "axios";

export async function getMe() {
    return axios.get("/api/users/me");
}
