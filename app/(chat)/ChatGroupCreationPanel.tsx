"use client";

import ChatGroupCreationForm from "@/app/(chat)/ChatGroupCreationForm";
import ChatGroupCreationMembers from "@/app/(chat)/ChatGroupCreationMembers";
import { IChat } from "@/types/global.types";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type CreateValue = Pick<IChat, "title" | "description"> & {
  memberIds: string[];
};

interface ChatGroupCreationPanelProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateValue) => void;
}

export default function ChatGroupCreationPanel({
  open,
  onClose,
  onCreate,
}: ChatGroupCreationPanelProps) {
  const [data, setData] = useState<Partial<CreateValue>>({
    title: "",
    description: "",
  });
  const [showMembers, setShowMembers] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  const handleBackClick = () => {
    if (showMembers) {
      setShowMembers(false);
    } else {
      onClose();
    }
  };

  const handleContinue = (
    formValue: Pick<CreateValue, "title" | "description">
  ) => {
    setData(formValue);
    setShowMembers(true);
  };

  const handleCreate = (memberIds: CreateValue["memberIds"]) => {
    onCreate({
      ...data,
      memberIds,
    });
  };

  useEffect(() => {
    if (!open) return;
    setData({
      title: "",
      description: "",
    });
    setShowMembers(false);
  }, [open]);

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "100vw", sm: "33vw" },
            minWidth: { sm: "300px" },
          }}
        >
          <Toolbar className="flex flex-row gap-2.5">
            <IconButton edge="start" onClick={handleBackClick}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              New Chat Group
            </Typography>
          </Toolbar>
          <Divider />

          {!showMembers && (
            <ChatGroupCreationForm
              open={open}
              defaultValues={data as any}
              onCancel={handleClose}
              onContinue={handleContinue}
            />
          )}

          {showMembers && (
            <ChatGroupCreationMembers
              open={open}
              onCancel={handleClose}
              onCreate={handleCreate}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
}
