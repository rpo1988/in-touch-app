export interface IContact {
  _id: string;
  name: string;
  statusInfo?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IChatMessage {
  date: Date | string;
  text: string;
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
