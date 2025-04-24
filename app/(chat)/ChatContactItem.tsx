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
import randomColor from "randomcolor";

interface ChatContactItemProps {
  id: string;
  primary: string;
  secondary?: string | null;
  selectable?: false | "single" | "multi";
  selected?: boolean;
  onSelected?: () => void;
}

export default function ChatContactItem({
  id,
  primary,
  secondary,
  selectable = false,
  selected = false,
  onSelected,
}: ChatContactItemProps) {
  const listItem = (
    <>
      <ListItemAvatar>
        <Avatar
          sx={{
            backgroundColor: randomColor({
              seed: id,
              luminosity: "bright",
              format: "hex",
            }),
          }}
        >
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
        disablePadding={!!selectable}
        sx={{
          maxHeight: 56,
        }}
        secondaryAction={
          selectable === "multi" ? (
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
