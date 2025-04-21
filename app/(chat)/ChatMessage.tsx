import { useMe } from "@/providers/ProfileProvider";
import { deleteMessage } from "@/services/chat.service";
import {
  ChatMessageStatusId,
  IChatListItem,
  IChatListMessage,
} from "@/types/global.types";
import { Check, ErrorOutline, MoreVert, Schedule } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import randomColor from "randomcolor";
import { forwardRef, useState } from "react";

type ChatMessageProps = {
  chatId: string;
  chatMessage: IChatListMessage;
  sentByMe: boolean;
  showOwner?: boolean;
};

export default forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(
    {
      chatId,
      chatMessage: { createdAt, text, status, id, user },
      sentByMe,
      showOwner,
    },
    ref
  ) {
    const queryClient = useQueryClient();
    const { me } = useMe();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const deleteMessageMutation = useMutation({
      mutationFn: () => deleteMessage(chatId, id),
      async onMutate() {
        // Cancel current requests
        queryClient.cancelQueries({
          queryKey: ["chat-list-item", me!.id, chatId],
        });
        // Retrieve prev data before appending anything
        const prevChatListItem = queryClient.getQueryData<IChatListItem>([
          "chat-list-item",
          me!.id,
          chatId,
        ])!;
        // Remove the message
        await queryClient.setQueryData<IChatListItem>(
          ["chat-list-item", me!.id, chatId],
          (currentData) => ({
            ...currentData!,
            lastMessages: currentData!.lastMessages.filter(
              (message) => message.id !== id
            ),
          })
        );
        // Return prev data and the new fake message
        return { prevData: prevChatListItem };
      },
      onSuccess(data, variables, context) {
        // Invalidate chat list cache only if last message was deleted
        const needToRevalidate =
          context.prevData.lastMessages.slice(-1)[0].id === data.id;
        if (needToRevalidate) {
          queryClient.invalidateQueries({
            queryKey: ["chat-list", me!.id],
          });
        }
      },
      onError(error, text, context) {
        // Append deleted message again
        queryClient.setQueryData<IChatListItem>(
          ["chat-list-item", me!.id, chatId],
          () => ({
            ...context!.prevData,
          })
        );
      },
    });

    const handleMoreOptions =
      (open: boolean) => (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(open ? event.currentTarget : null);
      };

    const handleDelete = async () => {
      setAnchorEl(null);
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
          {showOwner && !sentByMe && (
            <Typography
              variant="body2"
              sx={{
                color: randomColor({
                  seed: user.id,
                  luminosity: "bright",
                  format: "hsl",
                }),
              }}
            >
              ~ {user.name}
            </Typography>
          )}
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
            ) : status.id === ChatMessageStatusId.Error ? (
              <ErrorOutline
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

          {/* TODO: Pending support retry failed messages */}
          {sentByMe && status.id !== ChatMessageStatusId.Error && (
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
