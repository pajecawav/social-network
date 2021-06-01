import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { joinChatByCode } from "../api";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { ChatsContext } from "../contexts/ChatsContext";

export function JoinChatPage() {
    const { inviteCode } = useParams<{ inviteCode: string }>();
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [chatId, setChatId] = useState<boolean | null>(null);
    const { joinChat } = useContext(ChatsContext);

    useEffect(() => {
        if (!inviteCode) return;

        joinChatByCode(inviteCode)
            .then((response) => {
                joinChat(response.data.chatId);
                setChatId(response.data.chatId);
                setIsSuccess(true);
            })
            .catch((error) => {
                console.error(error);
                setIsSuccess(false);
            });
    }, [inviteCode, joinChat]);

    if (!inviteCode) {
        return <Redirect to="/chats" />;
    }

    if (isSuccess !== null) {
        return <Redirect to={isSuccess ? `/chats/${chatId}` : "/"} />;
    }

    return (
        <Container>
            <LoadingPlaceholder className="h-30" />
        </Container>
    );
}
