"use client";

import { useMe } from "@/providers/ProfileProvider";
import { Logout } from "@mui/icons-material";
import { Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChatListHeader() {
  const { logout } = useMe();
  const { replace } = useRouter();

  const handleLogout = () => {
    logout();
    replace("/login");
  };

  return (
    <>
      <div>
        <Toolbar className="flex flex-row justify-between">
          <Typography variant="h6" noWrap component="div">
            Chats
          </Typography>
          <IconButton onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </div>
      <Divider />
    </>
  );
}
