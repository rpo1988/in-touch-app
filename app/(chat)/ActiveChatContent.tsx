import ChatDateMessage from "@/app/(chat)/ChatDateMessage";
import ChatMessage from "@/app/(chat)/ChatMessage";
import { useMe } from "@/providers/ProfileProvider";
import { IChatMessage } from "@/types/global.types";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { RefObject, useCallback, useMemo } from "react";

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

  const setMessageRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        messageRefs.current.set(id, el);
      } else {
        messageRefs.current.delete(id);
      }
    },
    [messageRefs]
  );

  const allTypeOfMessages = useMemo(() => {
    let previousDate: Dayjs;
    const allMessages = (data || []).reduce((acc, message) => {
      const nextDate = dayjs(message.createdAt);
      if (!previousDate || !previousDate.isSame(nextDate, "day")) {
        acc.push(
          <ChatDateMessage key={nextDate.toString()} date={message.createdAt} />
        );
        previousDate = nextDate;
      }
      acc.push(
        <ChatMessage
          key={message._id}
          ref={setMessageRef(message._id)}
          _id={message._id}
          createdAt={message.createdAt}
          text={message.text}
          sentByMe={me!._id === message.createdBy._id}
          status={message.status}
        />
      );
      return acc;
    }, [] as React.ReactNode[]);
    return allMessages;
  }, [me, data, setMessageRef]);

  return (
    <>
      <div
        className={clsx("grow overflow-y-auto bg-gray-200 flex flex-col", {
          "items-center": isLoading,
          "justify-center": isLoading,
        })}
      >
        {isLoading ? <CircularProgress /> : !!data ? allTypeOfMessages : null}
        <div ref={setMessageRef(lastIdRef)}>{/* DO NOT REMOVE IT */}</div>
      </div>
    </>
  );
}
