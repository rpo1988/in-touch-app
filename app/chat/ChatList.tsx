import ChatItem from "@/app/chat/ChatItem";
import { getChatList } from "@/services/chat.service";
import { List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

type ChatListProps = {
  meId: string;
  onSelected: (id: string) => void;
};

export default function ChatList({ meId, onSelected }: ChatListProps) {
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat-list"],
    queryFn: () => getChatList(meId),
  });

  if (isLoading) return <div className="w-full p-4">Loading...</div>;
  if (error) return <div className="w-full p-4">Error loading chat list</div>;

  return (
    <List className="w-full">
      {chatList.map((item) => (
        <ChatItem
          key={item._id}
          contactName={item.contact.name}
          messageDate={item.previousMsg.date}
          onSelected={() => onSelected(item.contact._id)}
        />
      ))}
    </List>
  );
}
