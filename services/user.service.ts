import api from "@/lib/axios";
import { IUser, IUserContact, User } from "@/types/global.types";
import axios from "axios";

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const getContacts = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users", {
    params: {
      excludeMe: "true",
    },
  });
  return response.data || [];
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
