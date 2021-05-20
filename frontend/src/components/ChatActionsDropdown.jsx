import {
    LinkIcon,
    PaperClipIcon,
    SearchIcon,
    UserAddIcon,
} from "@heroicons/react/outline";
import React, { useContext } from "react";
import { Dropdown } from "../components/Dropdown";
import { UserContext } from "../contexts/UserContext";
import { DropdownMenuItem } from "../ui/DropdownMenuItem";

export function ChatActionsDropdown({
    chat,
    onOpenInviteToChat,
    onOpenInviteLink,
    ...props
}) {
    const { user } = useContext(UserContext);
    const isGroup = chat.chatType === "group";
    const isAdmin = chat.admin && user.userId === chat.admin.userId;

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
}
