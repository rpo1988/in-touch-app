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
  return response.data;
};

export const getChatHistory = async (
  meId: string,
  chatId: string
): Promise<IChatHistory> => {
  const response = await axios.get<IChatHistory>(
    `/api/me/${meId}/chat-history/${chatId}`
  );
  return response.data;
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
