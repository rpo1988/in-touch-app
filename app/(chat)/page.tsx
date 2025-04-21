"use client";

import ActiveChat from "@/app/(chat)/ActiveChat";
import ChatList from "@/app/(chat)/ChatList";
import { withProfile } from "@/hocs/withProfile";
import { Divider } from "@mui/material";
import { useState } from "react";

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string>();

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-[33vw] min-w-[300px] flex flex-row">
        <ChatList
          selectedId={selectedChat}
          onSelected={(id) => setSelectedChat(id)}
        />
        <Divider orientation="vertical" />
      </div>
      <div className="w-2/3">
        <ActiveChat chatId={selectedChat} />
      </div>
    </div>
  );
};

export default withProfile(ChatPage);
