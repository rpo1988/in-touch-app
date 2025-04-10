import ChatMessage from "@/app/(chat)/ChatMessage";
import { useMe } from "@/providers/ProfileProvider";
import { IChatMessage } from "@/types/global.types";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { RefObject } from "react";

export const lastIdRef = "chat-message-last";

interface ActiveChatContentProps {
  data?: IChatMessage[];
  isLoading: boolean;
  messageRefs: RefObject<Map<string, HTMLDivElement>>;
}

export default function ActiveChatContent({
  data,
  isLoading,
  messageRefs,
}: ActiveChatContentProps) {
  const { me } = useMe();

  const setMessageRef = (messageId: string) => (el: HTMLDivElement | null) => {
    if (el) {
      messageRefs.current.set(messageId, el);
    } else {
      messageRefs.current.delete(messageId);
    }
  };

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
              ref={setMessageRef(message._id)}
              key={message._id}
              _id={message._id}
              createdAt={message.createdAt}
              text={message.text}
              sentByMe={me!._id === message.createdBy._id}
            />
          ))
        ) : null}
        <div ref={setMessageRef(lastIdRef)}>{/* DO NOT REMOVE IT */}</div>
      </div>
    </>
  );
}
