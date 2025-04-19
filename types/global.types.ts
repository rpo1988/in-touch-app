export interface ApiError {
  message: string;
}

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
