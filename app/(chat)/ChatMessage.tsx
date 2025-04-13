import { IChatMessage, IChatMessageStatus } from "@/types/global.types";
import { Check, Schedule } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import clsx from "clsx";
import dayjs from "dayjs";
import { forwardRef } from "react";

type ChatMessageProps = Pick<
  IChatMessage,
  "_id" | "createdAt" | "text" | "status"
> & {
  sentByMe: boolean;
};

export default forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage({ createdAt, text, sentByMe, status }, ref) {
    return (
      <>
        <Paper
          component="div"
          ref={ref}
          sx={{
            bgcolor: sentByMe ? green["A100"] : "fff",
          }}
          className={clsx("flex flex-col mx-4 my-1 p-2", {
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
            {!sentByMe ? null : status === IChatMessageStatus.Received ? (
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
        </Paper>
      </>
    );
  }
);
