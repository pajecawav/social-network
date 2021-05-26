import { ArrowLeftIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { getChatTitle } from "../utils";
import { ChatActionsDropdown } from "./ChatActionsDropdown";
import { CircleAvatar } from "./CircleAvatar";

export function ChatHeader({
    onOpenChatInfo,
    onOpenInviteToChat,
    onOpenInviteLink,
}) {
    const { chat } = useContext(ChatContext);
    const isGroupChat = chat.chatType === "group";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isSmallScreen = useIsSmallScreen();

    const avatar = (
        <div className="flex-shrink-0 w-8 cursor-pointer">
            <CircleAvatar fileName={chat.peer?.avatar?.fullName} />
        </div>
    );

    return (
        <div className="flex items-center h-12 border-b border-primary-700">
            <Link
                className={clsx(
                    "flex items-center h-full px-4 py-2 text-center transition-all duration-200 text-primary-200 hover:bg-primary-700",
                    isSmallScreen ? "" : "w-20"
                )}
                to="/chats"
            >
                {isSmallScreen ? (
                    <ArrowLeftIcon className="w-6 text-secondary-600" />
                ) : (
                    "Back"
                )}
            </Link>

            <div className="flex-grow text-center text-semibold">
                {getChatTitle(chat)}
            </div>

            <div className="flex items-center gap-3 mr-4">
                <div className="relative">
                    <DotsHorizontalIcon
                        className="w-6 h-6 transition-colors duration-200 cursor-pointer hover:text-secondary-500"
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
                        onOpenInviteToChat={onOpenInviteToChat}
                        onOpenInviteLink={onOpenInviteLink}
                    />
                </div>

                {isGroupChat ? (
                    <div onClick={onOpenChatInfo}>{avatar}</div>
                ) : (
                    <Link to={`/users/${chat.peer.userId}`}>{avatar}</Link>
                )}
            </div>
        </div>
    );
}
