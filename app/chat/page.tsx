"use client";

import { LAST_CHATS, LastChat } from "@/app/chat/_mock";
import ActiveChat from "@/app/chat/ActiveChat";
import ChatList from "@/app/chat/ChatList";
import { Divider } from "@mui/material";
import { useState } from "react";

export default function Chat() {
  const [chats] = useState<LastChat[]>(LAST_CHATS);
  const [active, setActive] = useState<string>();

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-full max-w-1/3 flex flex-row">
        <ChatList items={chats} onSelected={(id) => setActive(id)} />
        <Divider orientation="vertical" />
      </div>
      <div className="grow">
        <ActiveChat chatId={active} />
      </div>
    </div>
  );
}
