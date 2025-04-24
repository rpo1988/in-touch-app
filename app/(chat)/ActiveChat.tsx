import ActiveChatContent, { lastIdRef } from "@/app/(chat)/ActiveChatContent";
import ActiveChatFooter from "@/app/(chat)/ActiveChatFooter";
import ActiveChatHeader from "@/app/(chat)/ActiveChatHeader";
import ChatInfoPanel from "@/app/(chat)/ChatInfoPanel";
import { useMe } from "@/providers/ProfileProvider";
import { useSocket } from "@/providers/SocketProvider";
import { getChatListItem } from "@/services/chat.service";
import {
  IChatListItem,
  IChatListMessage,
  IChatMessage,
} from "@/types/global.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ActiveChatProps = {
  chatId: string | null;
  onCloseClick: () => void;
};

export default function ActiveChat({ chatId, onCloseClick }: ActiveChatProps) {
  const [openInfoPanel, setOpenInfoPanel] = useState(false);
  const { me } = useMe();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const {
    data: chatListItem,
    isLoading,
    error,
  } = useQuery({
    enabled: !!chatId,
    queryKey: ["chat-list-item", me!.id, chatId],
    queryFn: () => getChatListItem(chatId!),
    select: (item) => ({
      ...item,
      membersWithoutMe: item.members.filter((item) => item.id !== me!.id),
    }),
  });
  const initialized = useRef(false);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const title = useMemo(() => {
    return !chatListItem
      ? ""
      : chatListItem.chat.isGroup
      ? chatListItem.chat.title!
      : chatListItem.membersWithoutMe[0].name;
  }, [chatListItem]);
  const description = useMemo(() => {
    return !chatListItem
      ? ""
      : chatListItem.chat.isGroup
      ? chatListItem.chat.description?.split("\n")[0]
      : chatListItem.membersWithoutMe[0].statusInfo;
  }, [chatListItem]);

  const scrollToMessage = (messageEl?: HTMLDivElement) => {
    if (!messageEl) return;
    messageEl.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleMessageSent = useCallback(() => {
    scrollToMessage(messageRefs.current.get(lastIdRef));
  }, []);

  const toggleInfoPanel = () => {
    setOpenInfoPanel((currentValue) => !currentValue);
  };

  const handleInfoClose = () => {
    toggleInfoPanel();
  };

  const handleMessage = useCallback(
    (payload: IChatMessage) => {
      // Update chat list messages only if it belongs to same chatId
      if (payload.chatId !== chatId) return;

      queryClient.setQueryData<IChatListItem>(
        ["chat-list-item", me!.id, chatId],
        (currentData) => ({
          ...currentData!,
          lastMessages: [
            ...currentData!.lastMessages,
            {
              id: payload.id,
              text: payload.text,
              createdAt: payload.createdAt,
              user: {
                id: payload.userId,
                name: payload.user?.name || payload.userId,
              },
              status: {
                id: payload.statusId,
              },
            } as IChatListMessage,
          ],
        })
      );

      setTimeout(() => {
        handleMessageSent();
      }, 100);
    },
    [chatId, me, queryClient, handleMessageSent]
  );

  useEffect(() => {
    if (!socket || !me || !queryClient || !chatId) return;

    // Listening to chat messages
    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, me, queryClient, chatId, handleMessage, handleMessageSent]);

  useEffect(() => {
    if (initialized.current || !chatListItem?.lastMessages) return;
    scrollToMessage(messageRefs.current.get(lastIdRef));
    initialized.current = true;
  }, [chatListItem?.lastMessages]);

  if (error)
    return <div className="w-full p-4">Error loading chat history</div>;

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {!!chatListItem && (
          <ActiveChatHeader
            id={chatId!}
            title={title}
            subtitle={description}
            isGroup={chatListItem.chat.isGroup}
            onInfoClick={toggleInfoPanel}
            onCloseClick={onCloseClick}
          />
        )}
        <ActiveChatContent
          chatId={chatListItem?.chat.id}
          isGroup={chatListItem?.chat.isGroup}
          data={chatListItem?.lastMessages}
          isLoading={isLoading}
          messageRefs={messageRefs}
        />
        {!!chatListItem && (
          <ActiveChatFooter
            chatId={chatListItem.chat.id}
            onMessageSent={handleMessageSent}
          />
        )}
      </div>

      <ChatInfoPanel
        open={openInfoPanel}
        chatInfo={chatListItem}
        onClose={handleInfoClose}
      />
    </>
  );
}
