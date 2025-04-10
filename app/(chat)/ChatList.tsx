import ChatItem from "@/app/(chat)/ChatItem";
import ChatListHeader from "@/app/(chat)/ChatListHeader";
import { useMe } from "@/providers/ProfileProvider";
import { getChatList } from "@/services/chat.service";
import { CircularProgress, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

type ChatListProps = {
  selectedId?: string;
  onSelected: (id: string) => void;
};

export default function ChatList({ selectedId, onSelected }: ChatListProps) {
  const { me } = useMe();
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    enabled: !!me?._id,
    queryKey: ["chat-list", me?._id],
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
    <div className="w-full flex flex-col">
      <ChatListHeader />
      <List className="w-full">
        {chatList.map((item) => (
          <ChatItem
            key={item._id}
            primary={item.title!}
            secondary={item.lastChatMessage?.text}
            third={item.createdAt}
            selected={item._id === selectedId}
            onSelected={() => onSelected(item._id)}
          />
        ))}
      </List>
    </div>
  );
}
