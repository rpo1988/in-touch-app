"use client";

import ChatContactList from "@/app/(chat)/ChatContactList";
import { ArrowBack, GroupAdd } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

interface ChatContactPanelProps {
  open: boolean;
  onClose: () => void;
  onSelected: (contactId: string) => void;
  onAddGroupClick: () => void;
}

export default function ChatContactPanel({
  open,
  onClose,
  onSelected,
  onAddGroupClick,
}: ChatContactPanelProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "100vw", sm: "33vw" },
            minWidth: { sm: "300px" },
          }}
        >
          <Toolbar className="flex flex-row gap-2.5 justify-between">
            <div className="flex flex-row gap-2.5 items-center">
              <IconButton edge="start" onClick={onClose}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                New Chat
              </Typography>
            </div>
            <div>
              <IconButton edge="end" onClick={onAddGroupClick}>
                <GroupAdd />
              </IconButton>
            </div>
          </Toolbar>
          <Divider />

          <ChatContactList
            open={open}
            selectable="single"
            onSelected={onSelected}
          />
        </Box>
      </Drawer>
    </>
  );
}
