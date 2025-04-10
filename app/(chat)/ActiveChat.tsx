import ActiveChatContent, { lastIdRef } from "@/app/(chat)/ActiveChatContent";
import ActiveChatFooter from "@/app/(chat)/ActiveChatFooter";
import ActiveChatHeader from "@/app/(chat)/ActiveChatHeader";
import { useMe } from "@/providers/ProfileProvider";
import { getChatHistory } from "@/services/chat.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type ActiveChatProps = {
  chatId?: string;
};

export default function ActiveChat({ chatId }: ActiveChatProps) {
  const { me } = useMe();
  const {
    data: chatHistory,
    isLoading,
    error,
  } = useQuery({
    enabled: !!chatId && !!me?._id,
    queryKey: ["chat-history", me!._id, chatId],
    queryFn: () => getChatHistory(me!._id, chatId!),
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
    if (initialized.current || !chatHistory?.history) return;
    scrollToMessage(messageRefs.current.get(lastIdRef));
    initialized.current = true;
  }, [chatHistory?.history]);

  if (error)
    return <div className="w-full p-4">Error loading chat history</div>;

  return (
    <div className="w-full h-full flex flex-col">
      {!!chatHistory && (
        <ActiveChatHeader
          title={chatHistory.title!}
          subtitle={chatHistory.description}
        />
      )}
      <ActiveChatContent
        data={chatHistory?.history}
        isLoading={isLoading}
        messageRefs={messageRefs}
      />
      {!!chatHistory && (
        <ActiveChatFooter
          chatId={chatHistory._id}
          onMessageSent={handleMessageSent}
        />
      )}
    </div>
  );
}
