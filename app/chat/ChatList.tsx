import { LastChat } from "@/app/chat/_mock";
import ChatItem from "@/app/chat/ChatItem";
import { List } from "@mui/material";

type ChatListProps = {
  items: LastChat[];
  onSelected: (id: string) => void;
};

export default function ChatList({ items, onSelected }: ChatListProps) {
  return (
    <List className="w-full">
      {items.map((item) => (
        <ChatItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          onSelected={onSelected}
        />
      ))}
    </List>
  );
}
