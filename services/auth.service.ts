import { IContact } from "@/types/global.types";
import axios from "axios";

export const signin = async (body: { username: string }): Promise<IContact> => {
  const response = await axios.post<IContact>("/api/auth/signin", body);
  return response.data;
};
