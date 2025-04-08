"use client";

import { getMe } from "@/services/chat.service";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const SS_KEY_USERNAME = "username";

const useInternalProfile = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const [meId, setMeId] = useState<string | null>(null);
  const { data, isFetching, error } = useQuery({
    enabled: !!meId,
    initialData: null,
    queryKey: ["me", meId],
    queryFn: () => getMe(meId!),
  });

  const login = async (username: string) => {
    // TODO: Comprobar si existe en BBDD antes
    Cookies.set(SS_KEY_USERNAME, username, { expires: 1 });
    setMeId(username);
  };

  const logout = () => {
    Cookies.remove(SS_KEY_USERNAME);
    queryClient.setQueryData(["me"], null);
    setMeId(null);
  };

  const retrievePrevSession = () => {
    const prevUsername = Cookies.get(SS_KEY_USERNAME);
    setMeId(prevUsername || null);
  };

  useEffect(() => {
    retrievePrevSession();
    setIsInitialized(true);
  }, []);

  return {
    me: data,
    isFetching,
    error,
    isInitialized,
    login,
    logout,
    retrievePrevSession,
  };
};

const ProfileContext = createContext<Pick<
  ReturnType<typeof useInternalProfile>,
  "me" | "isFetching" | "error" | "login" | "logout" | "retrievePrevSession"
> | null>(null);

export const useMe = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useMe must be used within a ProfileProvider");
  }

  return context;
};

type ProfileProviderProps = PropsWithChildren;

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const {
    me,
    isFetching,
    error,
    isInitialized,
    login,
    logout,
    retrievePrevSession,
  } = useInternalProfile();

  return (
    <ProfileContext.Provider
      value={{
        me,
        isFetching,
        error,
        login,
        logout,
        retrievePrevSession,
      }}
    >
      {!isInitialized ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        children
      )}
    </ProfileContext.Provider>
  );
};
