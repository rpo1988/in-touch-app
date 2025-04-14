import { IUser } from "@/types/global.types";
import axios from "axios";

export const signin = async (body: { username: string }): Promise<IUser> => {
  const response = await axios.post<IUser>("/api/auth/signin", body);
  return response.data;
};

export const signup = async (
  body: Pick<IUser, "username" | "name" | "statusInfo">
): Promise<IUser> => {
  const response = await axios.post<IUser>("/api/auth/signup", body);
  return response.data;
};
