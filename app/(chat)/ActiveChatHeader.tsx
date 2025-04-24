import { ArrowBack, Group, Person } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import randomColor from "randomcolor";

export type ActiveChatHeaderProps = {
  id: string;
  title: string;
  subtitle?: string | null;
  isGroup: boolean;
  onInfoClick: () => void;
  onCloseClick: () => void;
};

export default function ActiveChatHeader({
  id,
  title,
  subtitle,
  isGroup = false,
  onInfoClick,
  onCloseClick,
}: ActiveChatHeaderProps) {
  return (
    <>
      <Toolbar
        className="flex flex-row justify-between"
        sx={{
          bgcolor: grey[100],
        }}
      >
        <ListItem disablePadding component="div">
          <IconButton
            edge="start"
            sx={{
              marginRight: 0.5,
              flexShrink: 0,
            }}
            onClick={onCloseClick}
          >
            <ArrowBack />
          </IconButton>
          <ListItemAvatar
            sx={{
              cursor: "pointer",
            }}
            onClick={onInfoClick}
          >
            <Avatar
              sx={{
                backgroundColor: randomColor({
                  seed: id,
                  luminosity: isGroup ? "light" : "bright",
                  format: "hex",
                }),
              }}
            >
              {isGroup ? <Group /> : <Person />}
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
      </Toolbar>
      <Divider />
    </>
  );
}
