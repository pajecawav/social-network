import { useState } from "react";
import { createChat } from "../api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ModalBase } from "../ui/ModalBase";

export function CreateChatModal(props) {
    const [title, setTitle] = useState("");

    const handleCreateChat = () => {
        createChat({ title })
            .then((response) => {
                props?.onChatCreated?.(response.data);
                props?.onRequestClose?.();
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
}
