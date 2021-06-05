export type FriendStatus =
    | "friend"
    | "not_friend"
    | "request_sent"
    | "request_received";

export type User = {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: Image;

    isOnline: boolean;
    lastSeen: Date;

    friendStatus?: FriendStatus;
};

export type UserInfo = {
    status?: string;
    gender?: "male" | "female" | null;
    birthdate?: Date;
    relationshipStatus?: string;
    country?: string;
    city?: string;
    website?: string;
    email?: string;
};

export type Chat = {
    chatId: number;
    lastMessage?: Message;
    lastSeenMessageId?: number;
} & (
    | {
          chatType: "direct";
          peer: User;
      }
    | {
          chatType: "group";
          title: string;
          admin: User;
          avatar?: Image;
      }
);

export type Message = {
    messageId: number;
    text: string;
    timeSent: Date;
    timeEdited?: Date;
    user: User;
    action?: ChatAction;
};

export type ChatAction =
    | {
          chatActionType: "invite" | "kick";
          towardsUser: User;
      }
    | {
          chatActionType: "create" | "leave" | "join";
      };

export type FileType = "image";

export type File = {
    fileId: string;
    fileType: FileType;
    filename: string;
};

export type Image = File;

export type Group = {
    groupId: number;
    name: string;
    shortDescription?: string;
    description?: string;

    admin: User;
    avatar?: Image;

    isFollowing?: boolean;
};
