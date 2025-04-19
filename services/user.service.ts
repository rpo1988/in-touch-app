import api from "@/lib/axios";
import { IUser } from "@/types/global.types";

export const getMe = async (): Promise<IUser> => {
  const response = await api.get<IUser>("/users/me");
  return response.data;
};

export const getContacts = async (): Promise<IUser[]> => {
  const response = await api.get<IUser[]>("/users", {
    params: {
      excludeMe: "true",
    },
  });
  return response.data || [];
};
