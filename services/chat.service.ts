import {
  IChat,
  IChatHistory,
  IChatInfo,
  IChatMessage,
} from "@/types/global.types";
import axios from "axios";

export const getChatList = async (meId: string): Promise<IChatInfo[]> => {
  const response = await axios.get<IChatInfo[]>(`/api/me/${meId}/chat-list`);
  const enhancedResponse = response.data.map((chat) => ({
    ...chat,
    title:
      meId === chat.createdBy._id ? chat.members[0].name : chat.createdBy.name,
  }));
  return enhancedResponse;
};

export const getChatHistory = async (
  meId: string,
  chatId: string
): Promise<IChatHistory> => {
  const response = await axios.get<IChatHistory>(
    `/api/me/${meId}/chat-history/${chatId}`
  );
  const targetUser =
    meId === response.data.createdBy._id
      ? response.data.members[0]
      : response.data.createdBy;
  const enhancedResponse = {
    ...response.data,
    title: targetUser.name,
    description: targetUser.statusInfo,
  };
  return enhancedResponse;
};

export const sendMessage = async (
  meId: string,
  chatId: string,
  text: string
): Promise<IChatMessage> => {
  const body = {
    text,
  };
  const response = await axios.post<IChatMessage>(
    `/api/me/${meId}/chat-history/${chatId}/messages`,
    body
  );
  return response.data;
};

export const deleteMessage = async (
  meId: string,
  chatId: string,
  chatMessageId: string
): Promise<IChatMessage> => {
  const response = await axios.delete<IChatMessage>(
    `/api/me/${meId}/chat-history/${chatId}/messages/${chatMessageId}`
  );
  return response.data;
};

export const createChat = async (
  meId: string,
  contactId: string
): Promise<IChat> => {
  const body = {
    contactId,
  };
  const response = await axios.post<IChat>(`/api/me/${meId}/chat-list`, body);
  return response.data;
};

export const deleteChat = async (
  meId: string,
  chatId: string
): Promise<IChatMessage> => {
  const response = await axios.delete<IChatMessage>(
    `/api/me/${meId}/chat-list/${chatId}`
  );
  return response.data;
};
