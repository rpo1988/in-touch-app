import { useMe } from "@/providers/ProfileProvider";
import { sendMessage } from "@/services/chat.service";
import {
  ChatMessageStatusId,
  IChatList,
  IChatListItem,
  IChatListMessage,
} from "@/types/global.types";
import { Add, Mic, Send } from "@mui/icons-material";
import { Box, Divider, IconButton, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  text: string;
}

interface ActiveChatFooterProps {
  chatId: string;
  onMessageSent: () => void;
}

export default function ActiveChatFooter({
  chatId,
  onMessageSent,
}: ActiveChatFooterProps) {
  const queryClient = useQueryClient();
  const { me } = useMe();
  const {
    control,
    formState: { isValid },
    reset,
    watch,
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: {
      text: "",
    },
  });
  const text = watch("text");
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => sendMessage(chatId, text),
    async onMutate(text) {
      // Cancel current request
      queryClient.cancelQueries({
        queryKey: ["chat-list-item", me!.id, chatId],
      });
      // Retrieve prev data before appending anything
      const prevChatListItem = queryClient.getQueryData<IChatListItem>([
        "chat-list-item",
        me!.id,
        chatId,
      ])!;
      // Create a fake message to append
      const fakeMessage = {
        id: Math.random().toString(),
        text,
        createdAt: new Date(),
        user: {
          id: me!.id,
        },
        status: {
          id: ChatMessageStatusId.Sending,
        },
      } as IChatListMessage; // Force typing because backend response doesn't match this one but we don't need them yet
      // Append the fake message
      await queryClient.setQueryData<IChatListItem>(
        ["chat-list-item", me!.id, chatId],
        (currentData) => ({
          ...currentData!,
          lastMessages: [...currentData!.lastMessages, fakeMessage],
        })
      );
      // Clean form
      reset();
      // Notify parent to scroll container
      setTimeout(() => {
        onMessageSent();
      }, 100);
      // Return prev data and the new fake message
      return { prevData: prevChatListItem, fakeData: fakeMessage };
    },
    onSuccess(data, text, context) {
      // Replace the fake message for the real one
      queryClient.setQueryData<IChatListItem>(
        ["chat-list-item", me!.id, chatId],
        (currentData) => ({
          ...currentData!,
          lastMessages: currentData!.lastMessages.map((message) =>
            message.id === context.fakeData.id
              ? ({
                  id: data.id,
                  text: data.text,
                  createdAt: data.createdAt,
                  user: {
                    id: data.userId,
                  },
                  status: {
                    id: data.statusId,
                  },
                } as IChatListMessage)
              : message
          ),
        })
      );
      // For chat list, we didn't add the fake data before, so we only add it when it goes well
      queryClient.setQueryData<IChatList[]>(
        ["chat-list", me!.id],
        (currentData) =>
          currentData!.map((chatList) =>
            chatList.chat.id !== data.chatId
              ? chatList
              : {
                  ...chatList,
                  lastMessages: chatList.lastMessages.map((message) =>
                    // We replace message only if the last message is older than we sent
                    dayjs(message.createdAt).isBefore(dayjs(data.createdAt))
                      ? ({
                          id: data.id,
                          text: data.text,
                          createdAt: data.createdAt,
                          user: {
                            id: data.userId,
                          },
                          status: {
                            id: data.statusId,
                          },
                        } as IChatListMessage)
                      : message
                  ),
                }
          )
      );
    },
    onError(error, text, context) {
      // Replace message status in order to enable resend flow
      queryClient.setQueryData<IChatListItem>(
        ["chat-list-item", me!.id, chatId],
        (currentData) => ({
          ...currentData!,
          lastMessages: currentData!.lastMessages.map((message) =>
            message.id === context!.fakeData.id
              ? ({
                  ...context!.fakeData,
                  status: {
                    id: ChatMessageStatusId.Error,
                  },
                } as IChatListMessage)
              : message
          ),
        })
      );
    },
  });

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    sendMessageMutation.mutate(formValue.text);
  };

  useEffect(() => {
    if (sendMessageMutation.isPending) return;
    inputRef?.current?.focus();
  }, [chatId, sendMessageMutation.isPending]);

  return (
    <>
      <Divider />
      <Box
        component="form"
        autoComplete="off"
        noValidate
        sx={{
          bgcolor: grey[100],
        }}
        className="flex flex-row py-2 px-4 gap-3 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <IconButton disabled>
          <Add />
        </IconButton>
        <Controller
          name="text"
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Type a message"
              variant="outlined"
              className="grow"
              sx={{
                bgcolor: "white",
              }}
              autoComplete="off"
              inputRef={inputRef}
            />
          )}
        />
        <IconButton type={!text ? "button" : "submit"} disabled={!text}>
          {!text ? <Mic /> : <Send />}
        </IconButton>
      </Box>
    </>
  );
}
