import ChatMessage from "@/app/(chat)/ChatMessage";
import { IChatMessage } from "@/types/global.types";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";

interface ActiveChatContentProps {
  data?: IChatMessage[];
  isLoading: boolean;
}

export default function ActiveChatContent({
  data,
  isLoading,
}: ActiveChatContentProps) {
  return (
    <>
      <div
        className={clsx("grow overflow-y-auto bg-gray-200 flex flex-col", {
          "items-center": isLoading,
          "justify-center": isLoading,
        })}
      >
        {isLoading ? (
          <CircularProgress />
        ) : !!data ? (
          data.map((message) => <ChatMessage key={message._id} {...message} />)
        ) : null}
      </div>
    </>
  );
}
