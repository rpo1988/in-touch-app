import ChatItem from "@/app/(chat)/ChatItem";
import ChatListHeader from "@/app/(chat)/ChatListHeader";
import { useMe } from "@/providers/ProfileProvider";
import { createChat, deleteChat, getChatList } from "@/services/chat.service";
import { IChat } from "@/types/global.types";
import { CircularProgress, List } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ChatListProps = {
  selectedId?: string;
  onSelected: (id?: string) => void;
};

export default function ChatList({ selectedId, onSelected }: ChatListProps) {
  const { me } = useMe();
  const queryClient = useQueryClient();
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    enabled: !!me?._id,
    queryKey: ["chat-list", me!._id],
    queryFn: () => getChatList(me!._id),
  });
  const createChatMutation = useMutation({
    mutationFn: (contactId: string) => createChat(me!._id, contactId),
    onSuccess: async (newChat) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-list", me!._id],
      });
      onSelected(newChat._id);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteChat(me!._id, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-list", me!._id],
      });
      onSelected();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleContactSelected = (contactId: string) => {
    const currentChat = chatList.find((chat) =>
      chat.members.some((member) => member._id === contactId)
    );
    if (!!currentChat) {
      // Contact chat already created, so open it
      onSelected(currentChat._id);
    } else {
      // New contact chat, so create it and open it
      createChatMutation.mutate(contactId);
    }
  };

  const handleDelete = (chatId: string) => async () => {
    await queryClient.setQueryData(
      ["chat-list", me!._id],
      (currentValue: IChat[]) =>
        currentValue.filter((chat) => chat._id !== chatId)
    );
    deleteChatMutation.mutate(chatId);
  };

  if (isLoading)
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error) return <div className="w-full p-4">Error loading chat list</div>;

  return (
    <div className="w-full flex flex-col">
      <ChatListHeader onContactSelected={handleContactSelected} />
      <List className="w-full">
        {chatList.map((item) => (
          <ChatItem
            key={item._id}
            primary={item.title!}
            secondary={item.lastChatMessage?.text}
            third={item.lastChatMessage?.createdAt || item.createdAt}
            selected={item._id === selectedId}
            onSelected={() => onSelected(item._id)}
            onDelete={handleDelete(item._id)}
          />
        ))}
      </List>
    </div>
  );
}
