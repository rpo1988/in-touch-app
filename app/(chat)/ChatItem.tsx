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
  primary: string;
  secondary?: string;
  third: Date | string;
  selected?: boolean;
  onSelected: () => void;
};

export default function ChatItem({
  primary,
  secondary,
  third,
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
        {/* TODO: Control when there is more than 1 member (groups) */}
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
      <Typography
        component="span"
        variant="body2"
        color="textSecondary"
        sx={{
          position: "absolute",
          top: 8,
          right: 16,
          fontSize: 12,
          pointerEvents: "none",
        }}
      >
        {/* TODO: Pending format date according to proximity */}
        {dayjs(third).format("DD/MM/YYYY")}
      </Typography>
    </ListItem>
  );
}
