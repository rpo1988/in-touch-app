"use client";

import ChatContactList from "@/app/(chat)/ChatContactList";
import ChatContactNew from "@/app/(chat)/ChatContactNew";
import { Drawer } from "@mui/material";
import { useState } from "react";

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
  const [showNewContactView, setShowNewContactView] = useState(false);

  const handleClose = () => {
    setShowNewContactView(false);
    onClose();
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <div className="w-[33vw] min-w-[300px]">
          {showNewContactView ? (
            <ChatContactNew
              onCreated={onSelected}
              onClose={() => setShowNewContactView(false)}
            />
          ) : (
            <ChatContactList
              open={open}
              onClose={handleClose}
              onSelected={onSelected}
              onNewContact={() => setShowNewContactView(true)}
            />
          )}
        </div>
      </Drawer>
    </>
  );
}
