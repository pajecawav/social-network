import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { getChatInviteCode } from "../api";
import { ChatContext } from "../contexts/ChatContext";
import { Input } from "../ui/Input";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { ModalBase, ModalBaseProps } from "./ModalBase";

type InviteLinkModalProps = Omit<ModalBaseProps, "title">;

export const InviteLinkModal = (props: InviteLinkModalProps) => {
    const { chat } = useContext(ChatContext);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteCode, setInviteCode] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getChatInviteCode(chat!.chatId)
            .then((response) => {
                setInviteCode(response.data.inviteCode);
                setIsLoading(false);
            })
            .catch(console.error);
    }, [chat]);

    const revokeLink = () => {
        setIsLoading(true);
        getChatInviteCode(chat!.chatId, { reset: true })
            .then((response) => {
                setInviteCode(response.data.inviteCode);
                setIsLoading(false);
            })
            .catch(console.error);
    };

    const url = `${window.location.origin}/join/${inviteCode}`;

    return (
        <ModalBase
            title="Invitation link"
            style={{ content: { width: "30rem" } }}
            {...props}
        >
            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <div className="flex flex-col gap-2">
                    <div>
                        You can invite any person to the chat using the link
                        below.
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            className="w-full flex-shrink-1"
                            readOnly={true}
                            value={
                                inviteCode
                                    ? url
                                    : "No link has been generated yet"
                            }
                        />
                        <button
                            className="transition-colors duration-100 w-7 hover:text-secondary-500"
                            title="Copy to clipboard"
                            onClick={() => {
                                if (inviteCode)
                                    navigator.clipboard?.writeText(url);
                            }}
                        >
                            <ClipboardCopyIcon />
                        </button>
                    </div>
                    <div>
                        To invalidate the invitation, you can{" "}
                        <button
                            className="contents text-secondary-500"
                            onClick={revokeLink}
                        >
                            revoke the link.
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
};
