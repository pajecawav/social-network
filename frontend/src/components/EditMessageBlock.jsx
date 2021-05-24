import { CheckCircleIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function EditMessageBlock({ message, setMessage, onCancel, onSubmit }) {
    const isSmallScreen = useIsSmallScreen();

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full gap-2">
                <div>Edit</div>
                <button
                    className="cursor-pointer text-secondary-500 hover:underline"
                    onClick={() => {
                        document
                            .getElementById(`message_${message.messageId}`)
                            ?.scrollIntoView();
                    }}
                >
                    message
                </button>
                <div className="flex items-center justify-center w-8 ml-auto">
                    <XIcon
                        className="inline w-6 transition-colors duration-100 cursor-pointer text-primary-500 hover:text-primary-400"
                        onClick={onCancel}
                    />
                </div>
            </div>
            <form className="flex gap-4" onSubmit={handleSubmit}>
                <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Write a message"
                    value={message.text}
                    onChange={(value) => {
                        setMessage({
                            ...message,
                            text: value,
                        });
                    }}
                />
                {isSmallScreen ? (
                    <button className="w-8 text-secondary-600">
                        <CheckCircleIcon />
                    </button>
                ) : (
                    <Button>Save</Button>
                )}
            </form>
        </div>
    );
}
