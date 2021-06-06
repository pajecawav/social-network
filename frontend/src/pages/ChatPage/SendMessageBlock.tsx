import React, { FormEvent, useState } from "react";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { ReactComponent as SendIcon } from "../../icons/send.svg";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/Textarea";

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
            <Textarea
                className="flex-grow"
                placeholder="Write a message"
                value={text}
                maxRows={isSmallScreen ? 5 : 10}
                onChange={(event) => setText(event.target.value)}
            />
            {isSmallScreen ? (
                <button className="self-end w-8 text-secondary-600">
                    <SendIcon />
                </button>
            ) : (
                <Button className="self-end">Send</Button>
            )}
        </form>
    );
};
