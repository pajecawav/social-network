import { FormEvent, useState } from "react";
import { useHistory } from "react-router";
import { createGroup } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";

export const CreateGroupPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | null>(null);

    const history = useHistory();

    const handleCreateGroup = (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        if (!form.checkValidity()) return;

        createGroup({ name, description: description || undefined })
            .then((response) =>
                history.push(`/groups/${response.data.groupId}`)
            )
            .catch(console.error);
    };

    return (
        <Container className="h-full md:h-auto">
            <HeaderWithCount title="Create group" />
            <div className="flex flex-col items-center justify-center">
                <form
                    className="flex flex-col w-full sm:w-auto "
                    onSubmit={handleCreateGroup}
                >
                    <div className="grid items-start gap-y-4 gap-x-2 mt-6 px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]">
                        <FormField
                            id="name"
                            type="text"
                            label="Name:"
                            required={true}
                            autoFocus={true}
                            value={name || ""}
                            onChange={setName}
                        />
                        <Label
                            htmlFor="description"
                            text="Description (optional):"
                        />
                        <Textarea
                            id="description"
                            value={description || ""}
                            minRows={3}
                            maxRows={10}
                            maxLength={1000}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>

                    <Button className="mx-auto mt-6 mb-4 w-max">
                        Create group
                    </Button>
                </form>
            </div>
        </Container>
    );
};
