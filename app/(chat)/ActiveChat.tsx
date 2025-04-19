import ActiveChatContent, { lastIdRef } from "@/app/(chat)/ActiveChatContent";
import ActiveChatFooter from "@/app/(chat)/ActiveChatFooter";
import ActiveChatHeader from "@/app/(chat)/ActiveChatHeader";
import { useMe } from "@/providers/ProfileProvider";
import { getChatListItem } from "@/services/chat.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type ActiveChatProps = {
  chatId?: string;
};

export default function ActiveChat({ chatId }: ActiveChatProps) {
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

  const scrollToMessage = (messageEl?: HTMLDivElement) => {
    if (!messageEl) return;
    messageEl.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleMessageSent = () => {
    scrollToMessage(messageRefs.current.get(lastIdRef));
  };

  useEffect(() => {
    if (initialized.current || !chatListItem?.lastMessages) return;
    scrollToMessage(messageRefs.current.get(lastIdRef));
    initialized.current = true;
  }, [chatListItem?.lastMessages]);

  if (error)
    return <div className="w-full p-4">Error loading chat history</div>;

  return (
    <div className="w-full h-full flex flex-col">
      {!!chatListItem && (
        <ActiveChatHeader
          title={
            chatListItem.chat.isGroup
              ? chatListItem.chat.title!
              : chatListItem.membersWithoutMe[0].name
          }
          subtitle={
            chatListItem.chat.isGroup
              ? chatListItem.chat.description?.split("\n")[0]
              : chatListItem.membersWithoutMe[0].statusInfo
          }
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
  );
}
