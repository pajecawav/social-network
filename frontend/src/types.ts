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

export type Message = {
    messageId: number;
    text?: string;
    timeSent: Date;
    timeEdited?: Date;
    user: User;
    action?: ChatAction;
};

export type ChatAction =
    | {
          chatActionType: "invite" | "kick";
          towardsUser?: User;
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
