"use client";

import ChatContactItem from "@/app/(chat)/ChatContactItem";
import Info from "@/app/(chat)/Info";
import { IChatListItem } from "@/types/global.types";
import { Close, Group, Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";

interface ChatInfoPanelProps {
  open: boolean;
  chatInfo?: IChatListItem;
  onClose: () => void;
}

export default function ChatInfoPanel({
  open,
  chatInfo,
  onClose,
}: ChatInfoPanelProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "100vw", md: "67vw" },
            minWidth: { md: "300px" },
            maxWidth: { md: "600px" },
          }}
        >
          <Toolbar className="flex flex-row gap-2.5 justify-between">
            <div className="flex flex-row gap-2.5 items-center">
              <IconButton edge="start" onClick={onClose}>
                <Close />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Chat Info
              </Typography>
            </div>
          </Toolbar>
          <Divider />

          {open && chatInfo && (
            <div className="flex flex-col gap-6 overflow-y-auto">
              <div className="flex flex-col items-center px-4">
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    marginTop: 5,
                  }}
                >
                  {chatInfo.chat.isGroup ? (
                    <Group
                      sx={{
                        transform: "scale(5)",
                      }}
                    />
                  ) : (
                    <Person
                      sx={{
                        transform: "scale(5)",
                      }}
                    />
                  )}
                </Avatar>

                <Typography variant="h6" component="p" sx={{ marginTop: 2 }}>
                  {chatInfo.chat.isGroup
                    ? chatInfo.chat.title
                    : chatInfo.membersWithoutMe?.[0].name}
                </Typography>
                <Typography>
                  {chatInfo.chat.isGroup
                    ? `Group of ${chatInfo.members.length} members`
                    : chatInfo.membersWithoutMe?.[0].username}
                </Typography>
              </div>

              <Divider />

              <div className="flex flex-col px-4">
                <Typography variant="body2">
                  {chatInfo.chat.isGroup ? "Description" : "Status"}
                </Typography>
                <Typography variant="body1">
                  {chatInfo.chat.isGroup
                    ? chatInfo.chat.description
                    : chatInfo.membersWithoutMe?.[0].statusInfo}
                </Typography>
              </div>

              <Divider />

              {chatInfo.chat.isGroup && (
                <div className="flex flex-col">
                  <Typography
                    variant="body2"
                    sx={{
                      paddingX: 2,
                    }}
                  >
                    Members
                  </Typography>

                  {chatInfo.membersWithoutMe?.length ? (
                    <List>
                      {chatInfo.membersWithoutMe?.map((member) => (
                        <ChatContactItem
                          key={member.id}
                          id={member.id}
                          primary={member.name}
                          secondary={member.statusInfo}
                        />
                      ))}
                    </List>
                  ) : (
                    <div className="flex items-center justify-center p-4 mt-4">
                      <Info
                        title="You're Flying Solo!"
                        description="It looks like you're the only member of this group. Invite some friends to kick off the conversation!"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Box>
      </Drawer>
    </>
  );
}
