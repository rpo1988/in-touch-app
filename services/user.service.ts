import api from "@/lib/axios";
import { IUser, IUserContact } from "@/types/global.types";
import axios from "axios";

export const getMe = async (): Promise<IUser> => {
  const response = await api.get<IUser>("/users/me");
  return response.data;
};

export const getContacts = async (meId: string): Promise<IUser[]> => {
  const response = await axios.get<IUserContact>(`/api/me/${meId}/contacts`);
  return response.data?.contacts || [];
};

export const addContact = async (
  meId: string,
  contactUsername: string
): Promise<IUser[]> => {
  const response = await axios.post<IUserContact>(`/api/me/${meId}/contacts`, {
    contactUsername,
  });
  return response.data.contacts;
};
