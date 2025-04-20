"use client";

import { Person } from "@mui/icons-material";
import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface ChatContactItemProps {
  primary: string;
  secondary?: string | null;
  selectable?: boolean;
  selected?: boolean;
  onSelected?: () => void;
}

export default function ChatContactItem({
  primary,
  secondary,
  selectable = false,
  selected = false,
  onSelected,
}: ChatContactItemProps) {
  const listItem = (
    <>
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
    </>
  );

  return (
    <>
      <ListItem
        component="div"
        disablePadding={selectable}
        sx={{
          maxHeight: 56,
        }}
        secondaryAction={
          selectable ? (
            <Checkbox edge="end" onChange={onSelected} checked={selected} />
          ) : null
        }
      >
        {selectable ? (
          <ListItemButton
            sx={{
              maxHeight: "inherit",
            }}
            selected={selected}
            onClick={onSelected}
          >
            {listItem}
          </ListItemButton>
        ) : (
          listItem
        )}
      </ListItem>
    </>
  );
}
