"use client";

import ChatContactPanel from "@/app/(chat)/ChatContactPanel";
import { useMe } from "@/providers/ProfileProvider";
import { Add, Logout } from "@mui/icons-material";
import { Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChatListHeaderProps {
  onContactSelected: (contactId: string) => void;
}

export default function ChatListHeader({
  onContactSelected,
}: ChatListHeaderProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { logout } = useMe();
  const { replace } = useRouter();

  const toggleAddMenu = () => {
    setShowAddMenu((value) => !value);
  };

  const handleLogout = () => {
    logout();
    replace("/login");
  };

  const handleSelected = (contactId: string) => {
    toggleAddMenu();
    onContactSelected(contactId);
  };

  return (
    <>
      <Toolbar className="flex flex-row justify-between">
        <Typography variant="h6" noWrap component="div">
          Chats
        </Typography>
        <div>
          <IconButton onClick={toggleAddMenu}>
            <Add />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <Logout />
          </IconButton>
        </div>
      </Toolbar>
      <Divider />
      <ChatContactPanel
        open={showAddMenu}
        onClose={toggleAddMenu}
        onSelected={handleSelected}
      />
    </>
  );
}
