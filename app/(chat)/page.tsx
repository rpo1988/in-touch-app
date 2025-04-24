"use client";

import ActiveChat from "@/app/(chat)/ActiveChat";
import ChatList from "@/app/(chat)/ChatList";
import { withProfile } from "@/hocs/withProfile";
import { Box, Drawer } from "@mui/material";
import { useMemo, useState } from "react";

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const drawerContent = useMemo(() => {
    return (
      <ChatList
        selectedId={selectedChat}
        onSelected={(id) => setSelectedChat(id)}
      />
    );
  }, [selectedChat]);

  return (
    <div className="w-full h-full flex flex-row">
      <Drawer
        variant="temporary"
        anchor="left"
        open={!selectedChat}
        sx={{
          minWidth: "100vw",
          width: "100%",
          maxWidth: "100vw",
          flexDirection: "row",
          display: { xs: "flex", sm: "none" },
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "100vw",
              width: "100%",
              maxWidth: "100vw",
            },
          },
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        anchor="left"
        open
        sx={{
          minWidth: "300px",
          width: "100%",
          maxWidth: "33vw",
          flexDirection: "row",
          display: { xs: "none", sm: "flex" },
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "300px",
              width: "100%",
              maxWidth: "33vw",
            },
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box
        sx={{
          minWidth: 0,
          flexShrink: 0,
          width: { xs: "100vw", sm: "auto" },
          flex: "1 1 auto",
        }}
      >
        <ActiveChat
          chatId={selectedChat}
          onCloseClick={() => setSelectedChat(null)}
        />
      </Box>
    </div>
  );
};

export default withProfile(ChatPage);
