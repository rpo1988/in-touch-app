import { IChatMessage } from "@/types/global.types";
import { Paper, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import clsx from "clsx";
import dayjs from "dayjs";

type ChatMessageProps = Pick<IChatMessage, "_id" | "createdAt" | "text"> & {
  sentByMe: boolean;
};

export default function ChatMessage({
  _id,
  createdAt,
  text,
  sentByMe,
}: ChatMessageProps) {
  return (
    <>
      <Paper
        id={`message-${_id}`}
        sx={{
          bgcolor: sentByMe ? green["A100"] : "fff",
        }}
        className={clsx("flex flex-col mx-4 my-1 p-2", {
          "self-end": sentByMe,
          "self-start": !sentByMe,
        })}
      >
        <Typography variant="body1">{text}</Typography>
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
      </Paper>
    </>
  );
}
