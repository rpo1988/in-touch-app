"use client";

import { useMe } from "@/providers/ProfileProvider";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

const useInternalSocket = () => {
  const { me } = useMe();
  const [socket, setSocket] = useState<Socket>();
  const userId = me?.id;

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(`${URL}/chat`, {
      query: { userId },
    });
    setSocket(socketInstance);

    // Notify login
    socketInstance.emit("connected", { userId });

    // Cleanup on unmount
    return () => {
      // Notify logout
      socketInstance.emit("disconnected", { userId });
      socketInstance.disconnect();
    };
  }, [userId]);

  return {
    socket,
  };
};

const SocketContext = createContext<ReturnType<
  typeof useInternalSocket
> | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

type SocketProviderProps = PropsWithChildren;

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { socket } = useInternalSocket();

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
