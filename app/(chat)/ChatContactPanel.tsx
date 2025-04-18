"use client";

import ChatContactList from "@/app/(chat)/ChatContactList";
import { Drawer } from "@mui/material";

interface ChatContactPanelProps {
  open: boolean;
  onClose: () => void;
  onSelected: (contactId: string) => void;
}

export default function ChatContactPanel({
  open,
  onClose,
  onSelected,
}: ChatContactPanelProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <div className="w-[33vw] min-w-[300px]">
          <ChatContactList
            open={open}
            onClose={handleClose}
            onSelected={onSelected}
          />
        </div>
      </Drawer>
    </>
  );
}
