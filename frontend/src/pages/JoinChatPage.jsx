import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { joinChatByCode } from "../api";
import { Container } from "../components/Container";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";

export function JoinChatPage() {
    const { inviteCode } = useParams();
    const [isSuccess, setIsSuccess] = useState(null);
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        if (!inviteCode) return;

        joinChatByCode(inviteCode)
            .then((response) => {
                setChatId(response.data.chatId);
                setIsSuccess(true);
            })
            .catch((error) => {
                console.error(error);
                setIsSuccess(false);
            });
    }, [inviteCode]);

    if (!inviteCode) {
        return <Redirect to="/chats" />;
    }

    if (isSuccess !== null) {
        return <Redirect replace to={isSuccess ? `/chats/${chatId}` : "/"} />;
    }

    return (
        <Container>
            <LoadingPlaceholder className="h-30" />
        </Container>
    );
}
