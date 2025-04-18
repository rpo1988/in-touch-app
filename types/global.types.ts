export interface IBase {
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IUser extends IBase {
  username: string;
  name: string;
  statusInfo?: string;
  contacts: IUser[];
}

export enum IChatMessageStatus {
  Sending = 0,
  Received = 1,
}

export interface IChatMessage extends IBase {
  chat: IChat;
  createdBy: IUser;
  text: string;
  status: IChatMessageStatus;
}

export interface IChat extends IBase {
  createdBy: IUser;
  members: IUser[];
}

export interface IChatInfo extends IChat {
  title?: string;
  lastChatMessage: IChatMessage | null;
}

export interface IChatHistory extends IChat {
  title?: string;
  description?: string;
  history: IChatMessage[];
}

export interface ApiError {
  message: string;
}

export interface IUserContact extends IBase {
  user: IUser;
  contacts: IUser[];
}

// BACKEND INTERFACES

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  username: string;
  statusInfo?: string | null;
};

export type Chat = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isGroup: true;
  title?: string | null;
  description?: string | null;
};

export enum ChatMessageStatusId {
  Sending = "0",
  Received = "1",
}

export type ChatMessageStatus = {
  id: ChatMessageStatusId;
  name: string;
};

export type ChatMessage = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  chatId: string;
  statusId: string;
  text: string;
};

export type ChatListMessage = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, "id" | "name">;
  status: Pick<ChatMessageStatus, "id" | "name">;
  text: string;
};

export interface ChatList {
  chat: Pick<Chat, "id" | "isGroup" | "title" | "createdAt">;
  members: Pick<User, "id" | "name">[];
  lastMessages: ChatListMessage[];
}

export interface ChatListItem {
  chat: Chat;
  members: Pick<User, "id" | "name" | "statusInfo">[];
  lastMessages: ChatListMessage[];
}
