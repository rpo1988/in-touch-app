import ChatMessage from "@/app/(chat)/ChatMessage";
import { useMe } from "@/providers/ProfileProvider";
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
  const { me } = useMe();

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
          data.map((message) => (
            <ChatMessage
              key={message._id}
              _id={message._id}
              createdAt={message.createdAt}
              text={message.text}
              sentByMe={me?._id === message.createdBy._id}
            />
          ))
        ) : null}
      </div>
    </>
  );
}
