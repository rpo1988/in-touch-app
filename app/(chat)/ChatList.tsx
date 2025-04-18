import ChatContactPanel from "@/app/(chat)/ChatContactPanel";
import ChatItem from "@/app/(chat)/ChatItem";
import ChatListHeader from "@/app/(chat)/ChatListHeader";
import Info from "@/app/(chat)/Info";
import { useMe } from "@/providers/ProfileProvider";
import { createChat, deleteChat, getChatList } from "@/services/chat.service";
import { IChat } from "@/types/global.types";
import { transform } from "@/utils/text";
import { CircularProgress, List } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type ChatListProps = {
  selectedId?: string;
  onSelected: (id?: string) => void;
};

export default function ChatList({ selectedId, onSelected }: ChatListProps) {
  const { me } = useMe();
  const [openContactPanel, setOpenContactPanel] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat-list"],
    queryFn: () => getChatList(),
    select: (list) =>
      list.map((item) => ({
        ...item,
        membersWithoutMe: item.members.filter((item) => item.id !== me!.id),
      })),
  });
  const createChatMutation = useMutation({
    mutationFn: (contactId: string) => createChat(me!.id, contactId),
    onSuccess: async (newChat) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-list", me!.id],
      });
      onSelected(newChat._id);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteChat(me!.id, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-list", me!.id],
      });
      onSelected();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleContactSelected = (contactId: string) => {
    const currentChat = chatList.find((chat) =>
      chat.members.some((member) => member.id === contactId)
    );
    if (!!currentChat) {
      // Contact chat already created, so open it
      onSelected(currentChat.chat.id);
    } else {
      // New contact chat, so create it and open it
      createChatMutation.mutate(contactId);
    }
  };

  const handleDelete = (chatId: string) => async () => {
    await queryClient.setQueryData(
      ["chat-list", me!.id],
      (currentValue: IChat[]) =>
        currentValue.filter((chat) => chat._id !== chatId)
    );
    deleteChatMutation.mutate(chatId);
  };

  const toggleContactPanel = () => {
    setOpenContactPanel((value) => !value);
  };

  const handleSelected = (contactId: string) => {
    toggleContactPanel();
    handleContactSelected(contactId);
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
      <ChatListHeader onAddClick={toggleContactPanel} />

      <List className="w-full">
        {!chatList.length ? (
          <div className="mt-8 px-4 flex justify-center">
            <Info
              title={transform("No Chats Yet", "titlecase")}
              description="Haven't you started chatting yet? Choose a contact from your contact list and have fun!"
              actionText="Check my contacts"
              onActionClick={toggleContactPanel}
            />
          </div>
        ) : (
          chatList.map((item) => (
            <ChatItem
              key={item.chat.id}
              primary={
                item.chat.isGroup
                  ? item.chat.title!
                  : item.membersWithoutMe[0].name
              }
              secondary={item.lastMessages[0]?.text}
              third={item.lastMessages[0]?.createdAt || item.chat.createdAt}
              selected={item.chat.id === selectedId}
              onSelected={() => onSelected(item.chat.id)}
              onDelete={handleDelete(item.chat.id)}
            />
          ))
        )}
      </List>

      <ChatContactPanel
        open={openContactPanel}
        onClose={toggleContactPanel}
        onSelected={handleSelected}
      />
    </div>
  );
}
