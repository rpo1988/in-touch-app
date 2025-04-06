"use client";

import { getMe } from "@/services/chat.service";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";

interface UseInternalProfileProps {
  meId: string;
}

const useInternalProfile = ({ meId }: UseInternalProfileProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me", meId],
    queryFn: () => getMe(meId),
  });

  return {
    data,
    isLoading,
    error,
  };
};

const ProfileContext = createContext<Pick<
  ReturnType<typeof useInternalProfile>,
  "data" | "isLoading" | "error"
> | null>(null);

export const useMe = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useMe must be used within a ProfileProvider");
  }

  return context;
};

type ProfileProviderProps = PropsWithChildren & {
  meId: string;
};

export const ProfileProvider = ({ children, meId }: ProfileProviderProps) => {
  const { data, isLoading, error } = useInternalProfile({ meId });

  return (
    <ProfileContext.Provider value={{ data, isLoading, error }}>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        children
      )}
    </ProfileContext.Provider>
  );
};
