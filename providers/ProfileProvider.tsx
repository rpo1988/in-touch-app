"use client";

import { signin, signout } from "@/services/auth.service";
import { getMe } from "@/services/user.service";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";

const useInternalProfile = () => {
  const queryClient = useQueryClient();
  const { data, isFetching, error } = useQuery({
    initialData: null,
    queryKey: ["me"],
    queryFn: () => getMe(),
    retry: false,
  });

  const login = async (username: string) => {
    const data = await signin({ username });
    queryClient.setQueryData(["me"], data);
    queryClient.invalidateQueries({
      queryKey: ["me"],
    });
  };

  const logout = async () => {
    await signout();
    queryClient.cancelQueries();
    queryClient.resetQueries({
      queryKey: ["me"],
    });
  };

  return {
    me: data,
    isFetching,
    error,
    login,
    logout,
  };
};

const ProfileContext = createContext<Pick<
  ReturnType<typeof useInternalProfile>,
  "me" | "isFetching" | "error" | "login" | "logout"
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
  const { me, isFetching, error, login, logout } = useInternalProfile();

  return (
    <ProfileContext.Provider
      value={{
        me,
        isFetching,
        error,
        login,
        logout,
      }}
    >
      {isFetching ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        children
      )}
    </ProfileContext.Provider>
  );
};
