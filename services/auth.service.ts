import api from "@/lib/axios";
import { User } from "@/types/global.types";

export const signin = async (body: { username: string }): Promise<User> => {
  const response = await api.post<User>("/auth/signin", body);
  return response.data;
};

export const signup = async (
  body: Pick<User, "username" | "name" | "statusInfo">
): Promise<User> => {
  const response = await api.post<User>("/auth/signup", body);
  return response.data;
};

export const signout = async (): Promise<void> => {
  await api.post("/auth/signout");
};
