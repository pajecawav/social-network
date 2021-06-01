import React, { FormEvent, useState } from "react";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ReactComponent as SendIcon } from "../icons/send.svg";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type SendMessageBlockProps = {
    onSubmit: (text: string) => void;
};

export const SendMessageBlock = ({ onSubmit }: SendMessageBlockProps) => {
    const [text, setText] = useState("");
    const isSmallScreen = useIsSmallScreen();

    const handleSendMessage = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(text);
        setText("");
    };

    return (
        <form className="flex gap-4" onSubmit={handleSendMessage}>
            <Input
                className="flex-grow"
                type="text"
                placeholder="Write a message"
                value={text}
                onChange={setText}
            />
            {isSmallScreen ? (
                <button className="w-8 text-secondary-600">
                    <SendIcon />
                </button>
            ) : (
                <Button>Send</Button>
            )}
        </form>
    );
};
