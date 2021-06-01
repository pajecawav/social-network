import { FormEvent, useState } from "react";
import { sendMessage } from "../api";
import { Message } from "../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ModalBase, ModalBaseProps } from "./ModalBase";

type SendMessageModalProps = Omit<ModalBaseProps, "title"> & {
    autofocus?: boolean;
    toUserId: number;
    onMessageSent: (message: Message) => void;
    onRequestClose: () => void;
};

export const SendMessageModal = ({
    autofocus = true,
    toUserId,
    onMessageSent,
    onRequestClose,
    ...props
}: SendMessageModalProps) => {
    const [text, setText] = useState("");

    const resetText = () => setText("");

    const handleSendMessage = (event: FormEvent) => {
        event.preventDefault();

        if (!text) {
            return;
        }

        sendMessage({ userId: toUserId, message: { text } })
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
};
