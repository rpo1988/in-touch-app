import { LastChat } from "@/app/chat/_mock";
import { Person } from "@mui/icons-material";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export type ChatItemProps = LastChat & {
  onSelected: (id: string) => void;
};

export default function ChatItem({
  id,
  title,
  subtitle,
  onSelected,
}: ChatItemProps) {
  return (
    <ListItemButton onClick={() => onSelected(id)}>
      <ListItemAvatar>
        <Avatar>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} secondary={subtitle} />
    </ListItemButton>
  );
}
