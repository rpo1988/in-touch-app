export interface IBase {
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContact extends IBase {
  username: string;
  name: string;
  statusInfo?: string;
}

export interface IChatMessage extends IBase {
  chat: IChat;
  sourceContact: IContact;
  text: string;
}

export interface IChat extends IBase {
  sourceContact: IContact;
  targetContact: IContact;
}

export interface IChatInfo extends IChat {
  lastChatMessage: IChatMessage | null;
}

export interface IChatHistory extends IChat {
  history: IChatMessage[];
}

export interface ApiError {
  message: string;
}
