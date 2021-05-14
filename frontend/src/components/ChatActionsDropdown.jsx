import {
    PaperClipIcon,
    SearchIcon,
    UserAddIcon,
} from "@heroicons/react/outline";
import React from "react";
import { Dropdown } from "../components/Dropdown";
import { DropdownMenuItem } from "../ui/DropdownMenuItem";

export function ChatActionsDropdown({ chat, onOpenInviteToChat, ...props }) {
    const isGroup = chat.chatType === "group";

    return (
        <Dropdown
            className="w-max right-0 top-10 py-2 bg-primary-700 border border-primary-600 shadow-md"
            {...props}
        >
            <DropdownMenuItem icon={SearchIcon} text="Search messages" />
            <DropdownMenuItem icon={PaperClipIcon} text="Show attachments" />
            {isGroup && (
                <DropdownMenuItem
                    icon={UserAddIcon}
                    text="Invite to chat"
                    onClick={onOpenInviteToChat}
                />
            )}
        </Dropdown>
    );
}
