import api from "@/lib/axios";
import { IUser } from "@/types/global.types";

export const signin = async (body: { username: string }): Promise<IUser> => {
  const response = await api.post<IUser>("/auth/signin", body);
  return response.data;
};

export const signup = async (
  body: Pick<IUser, "username" | "name" | "statusInfo">
): Promise<IUser> => {
  const response = await api.post<IUser>("/auth/signup", body);
  return response.data;
};

export const signout = async (): Promise<void> => {
  await api.post("/auth/signout");
};
