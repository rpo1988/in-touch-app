import {
  IChatHistory,
  IChatInfo,
  IChatMessage,
  IUser,
} from "@/types/global.types";
import axios from "axios";

export const getMe = async (meId: string): Promise<IUser> => {
  const response = await axios.get<IUser>(`/api/me/${meId}`);
  return response.data;
};

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
    `/api/me/${meId}/chat-history/${chatId}`,
    body
  );
  return response.data;
};
