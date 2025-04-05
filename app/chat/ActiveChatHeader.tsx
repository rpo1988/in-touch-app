import { Person } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

export type ActiveChatHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ActiveChatHeader({
  title,
  subtitle,
}: ActiveChatHeaderProps) {
  return (
    <>
      <ListItem
        component="div"
        className="bg-gray-50"
        sx={{
          height: "56px",
          maxHeight: "56px",
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={subtitle}
          slotProps={{
            secondary: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
      </ListItem>
      <Divider />
    </>
  );
}
