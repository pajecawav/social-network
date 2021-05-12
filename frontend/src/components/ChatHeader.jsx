import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getChatTitle } from "../utils";
import { ChatActionsDropdown } from "./ChatActionsDropdown";
import { CircleAvatar } from "./CircleAvatar";

export function ChatHeader({ chat, onOpenChatInfo, onInviteToChat }) {
    const isGroupChat = chat.chatType === "group";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleAvatarClick = (event) => {
        event.preventDefault();
        onOpenChatInfo();
    };

    const avatar = (
        <div className="cursor-pointer w-8">
            <CircleAvatar />
        </div>
    );

    return (
        <div className="flex items-center h-12 border-b border-primary-700">
            <Link
                className="flex w-20 items-center px-4 h-full py-2 text-primary-200 text-center transition-all duration-200 hover:bg-primary-700"
                to="/chats"
            >
                Back
            </Link>

            <div className="flex-grow text-semibold text-center">
                {getChatTitle(chat)}
            </div>

            <div className="flex items-center gap-3 mr-4">
                <div className="relative">
                    <DotsHorizontalIcon
                        className="h-6 w-6 cursor-pointer transition-colors duration-200 hover:text-secondary-500"
                        onClick={() => {
                            if (!isDropdownOpen) {
                                setIsDropdownOpen(true);
                            }
                        }}
                    />

                    <ChatActionsDropdown
                        chat={chat}
                        isOpen={isDropdownOpen}
                        onRequestClose={() => setIsDropdownOpen(false)}
                        onInviteToChat={onInviteToChat}
                    />
                </div>

                {isGroupChat ? (
                    <div onClick={handleAvatarClick}>{avatar}</div>
                ) : (
                    <Link to={`/users/${chat.peer.userId}`}>{avatar}</Link>
                )}
            </div>
        </div>
    );
}
