import { IApiError } from "@/types/global.types";
import { AxiosError } from "axios";

export function getApiErrorMessage(
  error?: AxiosError<IApiError> | null
): string | null {
  return error?.response?.data.message || error?.message || null;
}
