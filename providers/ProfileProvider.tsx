"use client";

import { signin } from "@/services/auth.service";
import { getMe } from "@/services/user.service";
import { IUser } from "@/types/global.types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
};

export const setToken = (token: string | null) => {
  if (token) {
    window.localStorage.setItem("token", token);
  } else {
    window.localStorage.removeItem("token");
  }
};

const useInternalProfile = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const afterLogin = async (token: string | null) => {
    if (!token) {
      setToken(null);
      setUser(null);
    } else {
      setToken(token);
      const userResponse = await getMe();
      setUser(userResponse);
    }
  };

  const login = async (username: string) => {
    const data = await signin({ username });
    await afterLogin(data.access_token);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await afterLogin(getToken());
      } catch (error) {
        // Invalid token, so remove it
        setToken(null);
      }
      setInitialized(true);
    };

    init();
  }, []);

  return {
    initialized,
    me: user,
    login,
    logout,
  };
};

const ProfileContext = createContext<Pick<
  ReturnType<typeof useInternalProfile>,
  "me" | "initialized" | "login" | "logout"
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
  const profile = useInternalProfile();

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};
