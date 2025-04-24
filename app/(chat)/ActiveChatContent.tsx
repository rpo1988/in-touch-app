import ChatDateMessage from "@/app/(chat)/ChatDateMessage";
import ChatMessage from "@/app/(chat)/ChatMessage";
import { useMe } from "@/providers/ProfileProvider";
import { IChatListMessage } from "@/types/global.types";
import { Box, CircularProgress } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { RefObject, useCallback, useMemo } from "react";

export const lastIdRef = "chat-message-last";

interface ActiveChatContentProps {
  chatId?: string;
  isGroup?: boolean;
  data?: IChatListMessage[];
  isLoading: boolean;
  messageRefs: RefObject<Map<string, HTMLDivElement>>;
}

export default function ActiveChatContent({
  chatId,
  isGroup = false,
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
          key={message.id}
          ref={setMessageRef(message.id)}
          chatId={chatId!}
          chatMessage={message}
          sentByMe={me!.id === message.user.id}
          showOwner={isGroup}
        />
      );
      return acc;
    }, [] as React.ReactNode[]);
    return allMessages;
  }, [me, chatId, data, isGroup, setMessageRef]);

  return (
    <>
      <Box
        className={clsx("grow overflow-y-auto flex flex-col", {
          "items-center": isLoading,
          "justify-center": isLoading,
        })}
        sx={{
          bgcolor: blueGrey[50],
        }}
      >
        {isLoading ? <CircularProgress /> : !!data ? allTypeOfMessages : null}
        <div ref={setMessageRef(lastIdRef)}>{/* DO NOT REMOVE IT */}</div>
      </Box>
    </>
  );
}
