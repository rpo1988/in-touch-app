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
  onSelected: () => void;
};

export default function ChatItem({
  contactName,
  messageDate,
  onSelected,
}: ChatItemProps) {
  return (
    <ListItemButton onClick={onSelected}>
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
