import {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react";
import { getMe } from "../api";
import { getSocket } from "../sockets";
import { User } from "../types";
import { deleteLocalToken, saveLocalToken } from "../utils";

type UserContextValues = {
    user: User | null;
    loggedIn: boolean | null;
    logout: () => void;
    login: (token: string) => void;
    setUser: (user: User) => void;
};

export const UserContext = createContext<UserContextValues>(
    {} as UserContextValues
);

export function UserProvider({ children }: PropsWithChildren<{}>) {
    const [user, setUser] = useState<User | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

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

    useEffect(() => {
        if (user === null) {
            return;
        }

        const sio = getSocket("/online");
        const pingOnlineStatus = () => sio.emit("online");

        pingOnlineStatus();
        const interval = setInterval(pingOnlineStatus, 4 * 60 * 1000); // ping server every 4 minutes
        return () => {
            clearInterval(interval);
            sio.disconnect();
        };
    }, [user]);

    const login = useCallback((token) => {
        saveLocalToken(token);
        getMe().then((response) => {
            setUser(response.data);
            setLoggedIn(true);
        });
    }, []);

    const logout = useCallback(() => {
        deleteLocalToken();
        setUser(null);
        setLoggedIn(false);
    }, []);

    return (
        <UserContext.Provider
            value={{ user, loggedIn, logout, login, setUser }}
        >
            {children}
        </UserContext.Provider>
    );
}
