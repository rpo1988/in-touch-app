import ChatContactPanel from "@/app/(chat)/ChatContactPanel";
import ChatGroupCreationPanel from "@/app/(chat)/ChatGroupCreationPanel";
import ChatItem from "@/app/(chat)/ChatItem";
import ChatListHeader from "@/app/(chat)/ChatListHeader";
import Info from "@/app/(chat)/Info";
import { useMe } from "@/providers/ProfileProvider";
import { useSocket } from "@/providers/SocketProvider";
import { createChat, deleteChat, getChatList } from "@/services/chat.service";
import {
  IChat,
  IChatList,
  IChatListMessage,
  IChatMessage,
  IEventRemoveChat,
} from "@/types/global.types";
import { transform } from "@/utils/text";
import { CircularProgress, List } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatListProps = {
  selectedId?: string;
  onSelected: (id?: string) => void;
};

export default function ChatList({ selectedId, onSelected }: ChatListProps) {
  const { me } = useMe();
  const { socket } = useSocket();
  const [openContactPanel, setOpenContactPanel] = useState(false);
  const [openGroupCreationPanel, setOpenGroupCreationPanel] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: chatList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat-list", me!.id],
    queryFn: getChatList,
    select: (list) =>
      list.map((item) => ({
        ...item,
        membersWithoutMe: item.members.filter((item) => item.id !== me!.id),
      })),
  });

  const createChatMutation = useMutation({
    mutationFn: createChat,
    async onSuccess(data) {
      await queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) => [...currentData!, data]
      );
      onSelected(data.chat.id);
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    async onMutate(chatId) {
      // Cancel current requests
      queryClient.cancelQueries({
        queryKey: ["chat-list", me!.id],
      });
      // Retrieve prev data before appending anything
      const prevChatList = queryClient.getQueryData<IChatList[]>([
        "chat-list",
        me!.id,
      ])!;
      // Remove the chat
      await queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) =>
          currentData!.filter((child) => child.chat.id !== chatId)
      );
      // Return prev data
      return { prevData: prevChatList };
    },
    onSuccess(data, chatId) {
      // Unselect chat if it was selected
      if (selectedId === chatId) onSelected();
    },
    onError(error, chatId, context) {
      // Append deleted chat again
      queryClient.setQueryData<IChatList[]>(["chat-list", me!.id], () => [
        ...context!.prevData,
      ]);
    },
  });

  const handleContactSelected = (contactId: string) => {
    const currentChat = chatList.find(
      (chat) => !chat.chat.isGroup && chat.membersWithoutMe[0].id === contactId
    );
    if (!!currentChat) {
      // Contact chat already created, so open it
      onSelected(currentChat.chat.id);
    } else {
      // New single chat, so create it and open it
      createChatMutation.mutate({
        memberIds: [me!.id, contactId],
        isGroup: false,
      });
    }
  };

  const handleDelete = (chatId: string) => () => {
    deleteChatMutation.mutate(chatId);
  };

  const toggleContactPanel = () => {
    setOpenContactPanel((value) => !value);
  };

  const toggleGroupCreationPanel = () => {
    setOpenGroupCreationPanel((value) => !value);
  };

  const handleSelected = (contactId: string) => {
    toggleContactPanel();
    handleContactSelected(contactId);
  };

  const handleCreateGroup = (
    chatGroup: Pick<IChat, "title" | "description"> & { memberIds: string[] }
  ) => {
    toggleGroupCreationPanel();
    // Create a group chat and open it
    createChatMutation.mutate({
      memberIds: [...chatGroup.memberIds, me!.id],
      isGroup: true,
      title: chatGroup.title,
      description: chatGroup.description,
    });
  };

  const handleoAddGroupClick = () => {
    toggleContactPanel();
    toggleGroupCreationPanel();
  };

  const joinedChatListIds = useRef<string[]>([]);

  const handleMessage = useCallback(
    (payload: IChatMessage) => {
      // Update chat list
      queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) =>
          currentData!.map((chatList) =>
            chatList.chat.id === payload.chatId
              ? {
                  ...chatList,
                  lastMessages: [
                    {
                      id: payload.id,
                      text: payload.text,
                      createdAt: payload.createdAt,
                      user: {
                        id: payload.userId,
                      },
                      status: {
                        id: payload.statusId,
                      },
                    } as IChatListMessage,
                  ],
                }
              : chatList
          )
      );
    },
    [me, queryClient]
  );

  const handleRemoveChat = useCallback(
    (payload: IEventRemoveChat) => {
      // Update chat list
      queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) =>
          currentData!.filter((chatList) => chatList.chat.id !== payload.chatId)
      );
    },
    [me, queryClient]
  );

  const handleCreateChat = useCallback(
    (payload: IChatList) => {
      // Update chat list
      queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) => [...currentData!, payload]
      );
    },
    [me, queryClient]
  );

  useEffect(() => {
    if (!socket || !chatList || !me || !queryClient) return;

    const chatListIds = chatList.map((child) => child.chat.id);
    const pendingChatListIds = chatListIds.reduce((acc, id) => {
      return joinedChatListIds.current.includes(id) ? acc : [...acc, id];
    }, [] as string[]);

    // Join to chats
    if (pendingChatListIds.length) {
      joinedChatListIds.current = [
        ...joinedChatListIds.current,
        ...pendingChatListIds,
      ];
      socket.emit("joinChats", pendingChatListIds);
    }

    // Listening to chat events
    socket.on("message", handleMessage);
    socket.on("removeChat", handleRemoveChat);
    socket.on("createChat", handleCreateChat);

    return () => {
      socket.off("message", handleMessage);
      socket.off("removeChat", handleRemoveChat);
      socket.off("createChat", handleCreateChat);
    };
  }, [
    socket,
    chatList,
    me,
    queryClient,
    handleMessage,
    handleRemoveChat,
    handleCreateChat,
  ]);

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
              id={item.chat.id}
              primary={
                item.chat.isGroup
                  ? item.chat.title!
                  : item.membersWithoutMe[0].name
              }
              secondary={item.lastMessages[0]?.text}
              third={item.lastMessages[0]?.createdAt || item.chat.createdAt}
              selected={item.chat.id === selectedId}
              isGroup={item.chat.isGroup}
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
        onAddGroupClick={handleoAddGroupClick}
      />

      <ChatGroupCreationPanel
        open={openGroupCreationPanel}
        onClose={toggleGroupCreationPanel}
        onCreate={handleCreateGroup}
      />
    </div>
  );
}
