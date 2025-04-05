import { IChatHistory, IChatList } from "@/types/global.types";
import axios from "axios";

export const getChatList = async (meId: string): Promise<IChatList[]> => {
  const response = await axios.get<IChatList[]>(`/api/${meId}/chat-list`);
  return response.data;
};

export const getChatHistory = async (
  meId: string,
  contactId: string
): Promise<IChatHistory> => {
  const response = await axios.get<IChatHistory>(`/api/${meId}/chat-history`, {
    params: {
      contactId,
    },
  });
  return response.data;
};
