import { IUser } from "@/types/global.types";
import axios from "axios";

export const signin = async (body: { username: string }): Promise<IUser> => {
  const response = await axios.post<IUser>("/api/auth/signin", body);
  return response.data;
};
