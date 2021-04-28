import { useState } from "react";
import { createChat } from "../api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ModalBase } from "../ui/ModalBase";

export function CreateChatModal(props) {
    const [title, setTitle] = useState("");

    const handleCreateChat = (event) => {
        event.preventDefault();

        createChat({ title })
            .then((response) => {
                props?.onChatCreated?.(response.data);
                props?.onRequestClose?.();
                setTitle("");
            })
            .catch(console.error);
    };

    return (
        <ModalBase title="Create chat" {...props}>
            <form
                className="flex flex-col w-72 gap-4"
                onSubmit={handleCreateChat}
            >
                <Input
                    type="text"
                    value={title}
                    placeholder="Title"
                    required
                    onChange={(event) => setTitle(event.target.value)}
                />
                <Button>Create</Button>
            </form>
        </ModalBase>
    );
}
