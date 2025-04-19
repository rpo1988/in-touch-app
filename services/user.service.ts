import api from "@/lib/axios";
import { User } from "@/types/global.types";

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
