import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroup, updateGroup } from "../api";
import { Container } from "../components/Container";
import { HeaderWithCount } from "../components/HeaderWithCount";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { Group } from "../types";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { FormField } from "../ui/FormField";
import { FormSuccess } from "../ui/FormSuccess";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";

type GroupUpdateData = {
    name?: string;
    shortDescription?: string;
    description?: string;
};

export const ManageGroupPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [updatedGroup, setUpdatedGroup] = useState<GroupUpdateData>({});

    useEffect(() => {
        getGroup(groupId)
            .then((response) => setGroup(response.data))
            .catch(console.error);
    }, [groupId]);

    const setField = <T extends keyof GroupUpdateData>(
        name: T,
        value: GroupUpdateData[T]
    ) => {
        if (value) {
            updatedGroup[name] = value;
        } else {
            delete updatedGroup[name];
        }
        setUpdatedGroup(updatedGroup);
        setSuccess(null);
    };

    const handleUpdateGroup = (event: FormEvent) => {
        event.preventDefault();

        if (!group) return;

        updateGroup(group.groupId, updatedGroup)
            .then(() => {
                setSuccess(true);
            })
            .catch((error) => {
                console.error(error);
                setSuccess(false);
            });
    };

    return (
        <Container className="min-h-full md:min-h-0">
            <HeaderWithCount title="Group settings" className="flex" />

            {group === null ? (
                <LoadingPlaceholder />
            ) : (
                <div className="flex flex-col items-center justify-center my-4">
                    <form
                        className="flex flex-col w-full gap-4 sm:w-auto"
                        onSubmit={handleUpdateGroup}
                    >
                        <div className="grid items-center gap-y-4 gap-x-2 px-4 sm:px-0 grid-cols-1 sm:grid-cols-[max-content,auto]">
                            <FormField
                                id="name"
                                label="Name:"
                                type="text"
                                value={updatedGroup.name}
                                defaultValue={group.name}
                                maxLength={100}
                                onChange={(value) => setField("name", value)}
                            />
                            <FormField
                                id="shortDescription"
                                label="Short description:"
                                type="text"
                                value={updatedGroup.shortDescription}
                                defaultValue={group.shortDescription}
                                maxLength={100}
                                onChange={(value) =>
                                    setField("shortDescription", value)
                                }
                            />
                            <Label
                                htmlFor="description"
                                text="Description:"
                                className="self-start"
                            />
                            <Textarea
                                className="overflow-y-scroll sm:w-96"
                                id="description"
                                value={updatedGroup.description}
                                defaultValue={group.description}
                                minRows={4}
                                maxRows={10}
                                maxLength={1000}
                                onChange={(event) =>
                                    setField("description", event.target.value)
                                }
                            />
                        </div>

                        {success !== null && (
                            <div className="mx-auto mt-4 w-max">
                                {success ? (
                                    <FormSuccess text="Successfully updated group info." />
                                ) : (
                                    <FormError text="Error updating group info." />
                                )}
                            </div>
                        )}
                        <Button className="mx-auto my-4 w-max">Save</Button>
                    </form>
                </div>
            )}
        </Container>
    );
};
