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

export interface IChatMessage extends IBase {
  chat: IChat;
  createdBy: IUser;
  text: string;
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
