import ActiveChatContent from "@/app/(chat)/ActiveChatContent";
import ActiveChatFooter from "@/app/(chat)/ActiveChatFooter";
import ActiveChatHeader from "@/app/(chat)/ActiveChatHeader";
import { useMe } from "@/providers/ProfileProvider";
import { getChatHistory } from "@/services/chat.service";
import { useQuery } from "@tanstack/react-query";

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

  if (error)
    return <div className="w-full p-4">Error loading chat history</div>;

  return (
    <div className="w-full h-full flex flex-col">
      {!!chatHistory && (
        <ActiveChatHeader
          title={chatHistory.targetContact.name}
          subtitle={chatHistory.targetContact.statusInfo}
        />
      )}
      <ActiveChatContent data={chatHistory?.history} isLoading={isLoading} />
      {!!chatHistory && <ActiveChatFooter chatId={chatHistory._id} />}
    </div>
  );
}
