"use client";

import { useMe } from "@/providers/ProfileProvider";
import { Add, Logout } from "@mui/icons-material";
import { Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface ChatListHeaderProps {
  onAddClick: () => void;
}

export default function ChatListHeader({ onAddClick }: ChatListHeaderProps) {
  const { logout } = useMe();
  const { replace } = useRouter();

  const handleLogout = () => {
    logout();
    replace("/login");
  };

  return (
    <>
      <Toolbar className="flex flex-row justify-between">
        <Typography variant="h6" noWrap component="div">
          Chats
        </Typography>
        <div>
          <IconButton onClick={onAddClick}>
            <Add />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <Logout />
          </IconButton>
        </div>
      </Toolbar>
      <Divider />
    </>
  );
}
