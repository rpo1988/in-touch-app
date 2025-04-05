import ActiveChatContent from "@/app/chat/ActiveChatContent";
import ActiveChatFooter from "@/app/chat/ActiveChatFooter";
import ActiveChatHeader from "@/app/chat/ActiveChatHeader";
import { getChatHistory } from "@/services/chat.service";
import { useQuery } from "@tanstack/react-query";

type ActiveChatProps = {
  meId: string;
  contactId?: string;
};

export default function ActiveChat({ meId, contactId }: ActiveChatProps) {
  const {
    data: chatHistory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat-history", meId, contactId],
    queryFn: () => getChatHistory(meId, contactId!),
    enabled: !!contactId,
  });

  if (isLoading) return <div className="w-full p-4">Loading...</div>;
  if (error) return <div className="w-full p-4">Error loading chat list</div>;

  return (
    <div className="w-full h-full flex flex-col">
      {!chatHistory ? null : (
        <>
          <ActiveChatHeader
            title={chatHistory.contact.name}
            subtitle={chatHistory.contact.statusInfo}
          />
          <ActiveChatContent />
          <ActiveChatFooter />
        </>
      )}
    </div>
  );
}
