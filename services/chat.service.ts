import api from "@/lib/axios";
import {
  IChat,
  IChatList,
  IChatListItem,
  IChatMessage,
} from "@/types/global.types";

export const getChatList = async (): Promise<IChatList[]> => {
  const response = await api.get<IChatList[]>("/chat-list");
  return response.data;
};

export const getChatListItem = async (
  chatId: string
): Promise<IChatListItem> => {
  const response = await api.get<IChatListItem>(`/chat-list/${chatId}`);
  return response.data;
};

export const sendMessage = async (
  chatId: string,
  text: string
): Promise<IChatMessage> => {
  const body = {
    text,
  };
  const response = await api.post<IChatMessage>(
    `/chat-list/${chatId}/messages`,
    body
  );
  return response.data;
};

export const deleteMessage = async (
  chatId: string,
  chatMessageId: string
): Promise<Pick<IChatMessage, "id">> => {
  const response = await api.delete<IChatMessage>(
    `/chat-list/${chatId}/messages/${chatMessageId}`
  );
  return response.data;
};

export const createChat = async (contactId: string): Promise<IChat> => {
  const body = {
    memberIds: [contactId],
    isGroup: false,
  };
  const response = await api.post<IChat>("/chat-list", body);
  return response.data;
};

export const deleteChat = async (
  chatId: string
): Promise<Pick<IChat, "id">> => {
  const response = await api.delete<IChat>(`/chat-list/${chatId}`);
  return response.data;
};
