import { formatedDateMessage } from "@/utils/date";
import { MoreVert, Person } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type ChatItemProps = {
  primary: string;
  secondary?: string;
  third: Date | string;
  selected?: boolean;
  onSelected: () => void;
  onDelete: () => void;
};

export default function ChatItem({
  primary,
  secondary,
  third,
  selected,
  onSelected,
  onDelete,
}: ChatItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreOptions =
    (open: boolean) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(open ? event.currentTarget : null);
    };

  return (
    <>
      <ListItem
        component="div"
        disablePadding
        className="relative"
        sx={{
          ":hover #more-item-options": {
            opacity: 1,
          },
        }}
      >
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
          {formatedDateMessage(third)}
        </Typography>
        <>
          {/* More Options */}
          <IconButton
            id="more-item-options"
            size="small"
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              opacity: 0,
              transition: "opacity 0.2s",
              background:
                "radial-gradient(circle, rgb(255 255 255 0.04) 20%, transparent 100%)",
            }}
            onClick={handleMoreOptions(true)}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleMoreOptions(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={onDelete}>Delete</MenuItem>
          </Menu>
        </>
      </ListItem>
    </>
  );
}
