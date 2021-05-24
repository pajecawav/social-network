import { useState } from "react";
import { sendMessage } from "../api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ModalBase } from "../ui/ModalBase";

export function SendMessageModal({
    autofocus = true,
    toUserId,
    toChatId,
    onMessageSent,
    onRequestClose,
    ...props
}) {
    const [text, setText] = useState("");

    const resetText = () => setText("");

    const handleSendMessage = (event) => {
        event.preventDefault();

        if (!text) {
            return;
        }

        sendMessage({ userId: toUserId, chatId: toChatId, message: { text } })
            .then((response) => {
                onMessageSent?.(response.data);
                resetText();
            })
            .catch(console.error);
    };

    return (
        <ModalBase
            title="New message"
            onRequestClose={() => {
                resetText();
                onRequestClose();
            }}
            {...props}
        >
            <form
                className="flex flex-col gap-4 w-72"
                onSubmit={handleSendMessage}
            >
                <Input
                    type="text"
                    value={text}
                    placeholder="Write a message"
                    required
                    autoFocus={autofocus}
                    onChange={setText}
                />
                <Button>Send</Button>
            </form>
        </ModalBase>
    );
}
