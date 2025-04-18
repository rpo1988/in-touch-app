import api from "@/lib/axios";
import {
  Chat,
  ChatList,
  ChatListItem,
  ChatMessage,
  IChat,
} from "@/types/global.types";
import axios from "axios";

export const getChatList = async (): Promise<ChatList[]> => {
  const response = await api.get<ChatList[]>("/chat-list");
  return response.data;
};

export const getChatListItem = async (
  chatId: string
): Promise<ChatListItem> => {
  const response = await api.get<ChatListItem>(`/chat-list/${chatId}`);
  return response.data;
};

export const sendMessage = async (
  chatId: string,
  text: string
): Promise<ChatMessage> => {
  const body = {
    text,
  };
  const response = await api.post<ChatMessage>(
    `/chat-list/${chatId}/messages`,
    body
  );
  return response.data;
};

export const deleteMessage = async (
  chatId: string,
  chatMessageId: string
): Promise<Pick<ChatMessage, "id">> => {
  const response = await api.delete<ChatMessage>(
    `/chat-list/${chatId}/messages/${chatMessageId}`
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

export const deleteChat = async (chatId: string): Promise<Pick<Chat, "id">> => {
  const response = await api.delete<Chat>(`/chat-list/${chatId}`);
  return response.data;
};
