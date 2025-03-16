import { LAST_CHATS } from "@/app/chat/_mock";
import ActiveChatContent from "@/app/chat/ActiveChatContent";
import ActiveChatFooter from "@/app/chat/ActiveChatFooter";
import ActiveChatHeader from "@/app/chat/ActiveChatHeader";

type ActiveChatProps = {
  chatId?: string;
};

export default function ActiveChat({ chatId }: ActiveChatProps) {
  const lastChat = LAST_CHATS.find((item) => item.id === chatId);

  return (
    <div className="w-full h-full flex flex-col">
      {!lastChat ? null : (
        <>
          <ActiveChatHeader
            title={lastChat.title}
            subtitle={lastChat.subtitle}
          />
          <ActiveChatContent />
          <ActiveChatFooter />
        </>
      )}
    </div>
  );
}
