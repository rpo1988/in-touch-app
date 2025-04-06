import ChatItem from "@/app/chat/ChatItem";
import { useMe } from "@/providers/ProfileProvider";
import { getChatList } from "@/services/chat.service";
import { CircularProgress, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

type ChatListProps = {
  onSelected: (id: string) => void;
};

export default function ChatList({ onSelected }: ChatListProps) {
  const { data: me } = useMe();
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    enabled: !!me?._id,
    queryKey: ["chat-list"],
    queryFn: () => getChatList(me!._id),
  });

  if (isLoading)
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
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
