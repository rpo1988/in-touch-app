"use client";

import { Person } from "@mui/icons-material";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface ChatContactItemProps {
  primary: string;
  secondary?: string | null;
  onSelected: () => void;
}

export default function ChatContactItem({
  primary,
  secondary,
  onSelected,
}: ChatContactItemProps) {
  return (
    <>
      <ListItem component="div" disablePadding>
        <ListItemButton
          sx={{
            maxHeight: 56,
          }}
          onClick={onSelected}
        >
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={primary}
            secondary={secondary}
            slotProps={{
              primary: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              secondary: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}
