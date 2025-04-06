import {
  IChatHistory,
  IChatList,
  IChatMessage,
  IContact,
} from "@/types/global.types";
import axios from "axios";

export const getMe = async (meId: string): Promise<IContact> => {
  const response = await axios.get<IContact>(`/api/me/${meId}`);
  return response.data;
};

export const getChatList = async (meId: string): Promise<IChatList[]> => {
  const response = await axios.get<IChatList[]>(`/api/me/${meId}/chat-list`);
  return response.data;
};

export const getChatHistory = async (
  meId: string,
  contactId: string
): Promise<IChatHistory> => {
  const response = await axios.get<IChatHistory>(
    `/api/me/${meId}/chat-history`,
    {
      params: {
        contactId,
      },
    }
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
