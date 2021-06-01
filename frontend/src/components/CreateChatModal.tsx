import { MouseEvent, useState } from "react";
import { createChat } from "../api";
import { Chat } from "../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ModalBase, ModalBaseProps } from "./ModalBase";

type CreateChatModalProps = Omit<ModalBaseProps, "title"> & {
    onChatCreated: (chat: Chat) => void;
};

export const CreateChatModal = ({
    onChatCreated,
    ...props
}: CreateChatModalProps) => {
    const [title, setTitle] = useState("");

    const handleCreateChat = (event: MouseEvent | KeyboardEvent) => {
        createChat({ title })
            .then((response) => {
                onChatCreated?.(response.data);
                props?.onRequestClose?.(event as any);
                setTitle("");
            })
            .catch(console.error);
    };

    return (
        <ModalBase
            title="Create chat"
            {...props}
            style={{ content: { width: "18rem" } }}
        >
            <div className="flex flex-col gap-4">
                <Input
                    type="text"
                    value={title}
                    placeholder="Title"
                    required
                    onChange={setTitle}
                    onEnterPressed={handleCreateChat}
                />
                <Button onClick={handleCreateChat}>Create</Button>
            </div>
        </ModalBase>
    );
};
