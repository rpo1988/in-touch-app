"use client";

import ActiveChat from "@/app/(chat)/ActiveChat";
import ChatList from "@/app/(chat)/ChatList";
import { withProfile } from "@/hocs/withProfile";
import { Divider } from "@mui/material";
import { useState } from "react";

export default withProfile(function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string>();

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-1/3 min-w-[250px] flex flex-row">
        <ChatList
          selectedId={selectedContact}
          onSelected={(id) => setSelectedContact(id)}
        />
        <Divider orientation="vertical" />
      </div>
      <div className="w-2/3">
        <ActiveChat contactId={selectedContact} />
      </div>
    </div>
  );
});
