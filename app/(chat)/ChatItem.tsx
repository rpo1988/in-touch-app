import { Person } from "@mui/icons-material";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";

export type ChatItemProps = {
  contactName: string;
  messageDate: Date | string;
  selected?: boolean;
  onSelected: () => void;
};

export default function ChatItem({
  contactName,
  messageDate,
  selected,
  onSelected,
}: ChatItemProps) {
  return (
    <ListItemButton selected={selected} onClick={onSelected}>
      <ListItemAvatar>
        <Avatar>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={contactName}
        secondary={dayjs(messageDate).format("DD/MM/YYYY")}
      />
    </ListItemButton>
  );
}
