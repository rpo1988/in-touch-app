import { useMe } from "@/providers/ProfileProvider";
import { deleteMessage } from "@/services/chat.service";
import {
  ChatListMessage,
  ChatMessageStatusId,
  IChatHistory,
} from "@/types/global.types";
import { Check, MoreVert, Schedule } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { forwardRef, useState } from "react";

type ChatMessageProps = {
  chatId: string;
  chatMessage: ChatListMessage;
  sentByMe: boolean;
};

export default forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(
    { chatId, chatMessage: { createdAt, text, status, id }, sentByMe },
    ref
  ) {
    const queryClient = useQueryClient();
    const { me } = useMe();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const deleteMessageMutation = useMutation({
      mutationFn: () => deleteMessage(me!.id, chatId, id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["chat-list-item", me!.id, chatId],
        });
        queryClient.invalidateQueries({
          queryKey: ["chat-list", me!.id],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

    const handleMoreOptions =
      (open: boolean) => (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(open ? event.currentTarget : null);
      };

    const handleDelete = async () => {
      setAnchorEl(null);
      await queryClient.setQueryData(
        ["chat-list-item", me!.id, chatId],
        (currentValue: IChatHistory) => {
          const newValue: IChatHistory = {
            ...currentValue,
            history: currentValue.history.filter((msg) => msg._id !== id),
          };
          return newValue;
        }
      );
      deleteMessageMutation.mutate();
    };

    return (
      <>
        <Paper
          component="div"
          ref={ref}
          sx={{
            bgcolor: sentByMe ? green["A100"] : "fff",
            ":hover #more-message-options": {
              opacity: 1,
            },
          }}
          className={clsx("relative flex flex-col mx-4 my-1 p-2", {
            "self-end": sentByMe,
            "self-start": !sentByMe,
          })}
        >
          <Typography variant="body1">{text}</Typography>
          <div className="flex gap-0.5 justify-end">
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-right"
              sx={{
                fontSize: 12,
              }}
            >
              {dayjs(createdAt).format("HH:mma")}
            </Typography>
            {!sentByMe ? null : status.id === ChatMessageStatusId.Received ? (
              <Check
                sx={{
                  fontSize: 16,
                }}
              />
            ) : (
              <Schedule
                sx={{
                  fontSize: 16,
                }}
              />
            )}
          </div>

          {sentByMe && (
            <>
              {/* More Options */}
              <IconButton
                id="more-message-options"
                size="small"
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  opacity: 0,
                  transition: "opacity 0.2s",
                  background:
                    "radial-gradient(circle, rgb(185 246 202) 20%, transparent 100%)",
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
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Paper>
      </>
    );
  }
);
