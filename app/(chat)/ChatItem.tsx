import { Person } from "@mui/icons-material";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export type ChatItemProps = {
  contactName: string;
  lastMessage?: string;
  messageDate: Date | string;
  selected?: boolean;
  onSelected: () => void;
};

export default function ChatItem({
  contactName,
  lastMessage,
  messageDate,
  selected,
  onSelected,
}: ChatItemProps) {
  return (
    <ListItem component="div" disablePadding className="relative">
      <ListItemButton
        selected={selected}
        onClick={onSelected}
        sx={{
          maxHeight: 56,
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={contactName} secondary={lastMessage} />
      </ListItemButton>
      <Typography
        component="span"
        variant="body2"
        color="textSecondary"
        sx={{
          position: "absolute",
          top: 8,
          right: 16,
          fontSize: 12,
        }}
      >
        {/* TODO: Pending format date according to proximity */}
        {dayjs(messageDate).format("DD/MM/YYYY")}
      </Typography>
    </ListItem>
  );
}
