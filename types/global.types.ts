export interface IApiError {
  message: string;
}

export type IUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  username: string;
  statusInfo?: string | null;
};

export type IChat = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isGroup: boolean;
  title?: string | null;
  description?: string | null;
};

export enum ChatMessageStatusId {
  Error = "-1",
  Sending = "0",
  Received = "1",
}

export type IChatMessageStatus = {
  id: ChatMessageStatusId;
  name: string;
};

export type IChatMessage = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: Pick<IUser, "id" | "name">;
  chatId: string;
  statusId: string;
  text: string;
};

export type IChatListMessage = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: IUser["id"];
  user: Pick<IUser, "id" | "name">;
  statusId?: IChatMessageStatus["id"];
  status: Pick<IChatMessageStatus, "id" | "name">;
  text: string;
  chatId?: string;
};

export type IChatList = {
  chat: Pick<IChat, "id" | "isGroup" | "title" | "createdAt">;
  members: Pick<IUser, "id" | "name">[];
  lastMessages: IChatListMessage[];
};

export type IChatListItem = {
  chat: IChat;
  members: Pick<IUser, "id" | "name" | "username" | "statusInfo">[];
  membersWithoutMe?: Pick<IUser, "id" | "name" | "username" | "statusInfo">[];
  lastMessages: IChatListMessage[];
};

export interface IEventRemoveChat {
  chatId: string;
}
