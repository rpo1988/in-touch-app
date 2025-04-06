export interface IContact {
  _id: string;
  name: string;
  statusInfo?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IChatMessage {
  _id: string;
  date: Date | string;
  text: string;
  sentByMe: boolean;
}

export interface IChatList {
  _id: string;
  contact: IContact;
  me: IContact;
  previousMsg: IChatMessage;
}

export interface IChatHistory {
  _id: string;
  contact: IContact;
  me: IContact;
  history: IChatMessage[];
}
