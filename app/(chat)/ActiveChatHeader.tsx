import { Group, Person } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { grey } from "@mui/material/colors";

export type ActiveChatHeaderProps = {
  title: string;
  subtitle?: string | null;
  isGroup: boolean;
  onInfoClick: () => void;
};

export default function ActiveChatHeader({
  title,
  subtitle,
  isGroup = false,
  onInfoClick,
}: ActiveChatHeaderProps) {
  return (
    <>
      <ListItem
        component="div"
        sx={{
          height: "64px",
          minHeight: "64px",
          maxHeight: "64px",
          bgcolor: grey[100],
        }}
      >
        <ListItemAvatar
          sx={{
            cursor: "pointer",
          }}
          onClick={onInfoClick}
        >
          <Avatar>{isGroup ? <Group /> : <Person />}</Avatar>
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
