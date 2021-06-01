import { createContext } from "react";
import { useChat } from "../hooks/useChat";

type ChatContextValues = ReturnType<typeof useChat>;

export const ChatContext = createContext<ChatContextValues>(
    {} as ChatContextValues
);
