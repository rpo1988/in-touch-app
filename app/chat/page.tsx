"use client";

import ActiveChat from "@/app/chat/ActiveChat";
import ChatList from "@/app/chat/ChatList";
import { Divider } from "@mui/material";
import { useState } from "react";

export default function Chat() {
  const prevMeId = "67f0ace5458efc03732814cc";
  const [meId] = useState<string>(prevMeId);
  const [selectedContact, setSelectedContact] = useState<string>();

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-1/3 flex flex-row">
        <ChatList meId={meId} onSelected={(id) => setSelectedContact(id)} />
        <Divider orientation="vertical" />
      </div>
      <div className="w-2/3">
        <ActiveChat meId={meId} contactId={selectedContact} />
      </div>
    </div>
  );
}
