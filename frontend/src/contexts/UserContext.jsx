import { createContext, useEffect, useState } from "react";
import { getMe } from "../api";
import { deleteLocalToken, saveLocalToken } from "../utils";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        getMe()
            .then((response) => {
                setUser(response.data);
                setLoggedIn(true);
            })
            .catch(() => {
                setLoggedIn(false);
            });
    }, []);

    const login = (token) => {
        saveLocalToken(token);
        getMe().then((response) => {
            setUser(response.data);
            setLoggedIn(true);
        });
    };

    const logout = () => {
        deleteLocalToken();
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <UserContext.Provider
            value={{ user, loggedIn, logout, login, setUser }}
        >
            {children}
        </UserContext.Provider>
    );
}
