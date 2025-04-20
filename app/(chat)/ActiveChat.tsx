import ActiveChatContent, { lastIdRef } from "@/app/(chat)/ActiveChatContent";
import ActiveChatFooter from "@/app/(chat)/ActiveChatFooter";
import ActiveChatHeader from "@/app/(chat)/ActiveChatHeader";
import ChatInfoPanel from "@/app/(chat)/ChatInfoPanel";
import { useMe } from "@/providers/ProfileProvider";
import { getChatListItem } from "@/services/chat.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

type ActiveChatProps = {
  chatId?: string;
};

export default function ActiveChat({ chatId }: ActiveChatProps) {
  const [openInfoPanel, setOpenInfoPanel] = useState(false);
  const { me } = useMe();
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

  const handleMessageSent = () => {
    scrollToMessage(messageRefs.current.get(lastIdRef));
  };

  const toggleInfoPanel = () => {
    setOpenInfoPanel((currentValue) => !currentValue);
  };

  const handleInfoClose = () => {
    toggleInfoPanel();
  };

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
            title={title}
            subtitle={description}
            isGroup={chatListItem.chat.isGroup}
            onInfoClick={toggleInfoPanel}
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
