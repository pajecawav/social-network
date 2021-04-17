import { createContext, useEffect, useState } from "react";
import { deleteLocalToken, saveLocalToken } from "../utils";
import { getMe } from "../api";
import { camelizeKeys } from "humps";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(null);

    useEffect(() => {
        getMe()
            .then((response) => {
                setUser(camelizeKeys(response.data));
                setLoggedIn(true);
            })
            .catch(() => {
                setLoggedIn(false);
            });
    }, []);

    const login = (token) => {
        saveLocalToken(token);
        getMe().then((response) => {
            setUser(camelizeKeys(response.data));
            setLoggedIn(true);
        });
    };

    const logout = () => {
        deleteLocalToken();
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <UserContext.Provider value={{ user, loggedIn, logout, login }}>
            {children}
        </UserContext.Provider>
    );
}
