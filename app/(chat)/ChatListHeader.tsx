"use client";

import { useMe } from "@/providers/ProfileProvider";
import { Add, Logout } from "@mui/icons-material";
import { Divider, IconButton, Toolbar, Typography } from "@mui/material";

interface ChatListHeaderProps {
  onAddClick: () => void;
}

export default function ChatListHeader({ onAddClick }: ChatListHeaderProps) {
  const { me, logout } = useMe();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Toolbar className="flex flex-row justify-between">
        <Typography variant="h6" noWrap component="div">
          {me!.name}&apos;s Chats
        </Typography>
        <div className="flex gap-1">
          <IconButton onClick={onAddClick}>
            <Add />
          </IconButton>
          <IconButton edge="end" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </div>
      </Toolbar>
      <Divider />
    </>
  );
}
