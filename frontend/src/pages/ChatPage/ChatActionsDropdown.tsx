import {
    LinkIcon,
    PaperClipIcon,
    SearchIcon,
    UserAddIcon,
} from "@heroicons/react/outline";
import { useContext } from "react";
import { Dropdown, DropdownProps } from "../../components/Dropdown";
import { UserContext } from "../../contexts/UserContext";
import { Chat } from "../../types";
import { DropdownMenuItem } from "../../ui/DropdownMenuItem";

type ChatActionsDropdownProps = DropdownProps & {
    chat: Chat;
    onOpenInviteToChat: () => void;
    onOpenInviteLink: () => void;
};

export const ChatActionsDropdown = ({
    chat,
    onOpenInviteToChat,
    onOpenInviteLink,
    ...props
}: ChatActionsDropdownProps) => {
    const { user } = useContext(UserContext);
    const isGroup = chat.chatType === "group";
    const isAdmin =
        chat.chatType === "group" &&
        chat.admin &&
        user !== null &&
        user.userId === chat.admin.userId;

    return (
        <Dropdown
            className="right-0 py-2 border shadow-md w-max top-10 bg-primary-700 border-primary-600"
            closeOnClick={true}
            {...props}
        >
            <DropdownMenuItem icon={SearchIcon} text="Search messages" />
            <DropdownMenuItem icon={PaperClipIcon} text="Show attachments" />
            {isGroup && (
                <>
                    <DropdownMenuItem
                        icon={UserAddIcon}
                        text="Invite to chat"
                        onClick={onOpenInviteToChat}
                    />
                    {isAdmin && (
                        <DropdownMenuItem
                            icon={LinkIcon}
                            text="Invite link"
                            onClick={onOpenInviteLink}
                        />
                    )}
                </>
            )}
        </Dropdown>
    );
};
