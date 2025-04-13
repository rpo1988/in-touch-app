import { useMe } from "@/providers/ProfileProvider";
import { sendMessage } from "@/services/chat.service";
import {
  IChatHistory,
  IChatMessage,
  IChatMessageStatus,
} from "@/types/global.types";
import { Add, Mic, Send } from "@mui/icons-material";
import { Box, Divider, IconButton, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const addMutation = useMutation({
    mutationFn: (text: string) => sendMessage(me!._id, chatId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-history", me!._id, chatId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chat-list", me!._id],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    await queryClient.setQueryData(
      ["chat-history", me!._id, chatId],
      (currentValue: IChatHistory) => {
        const newValue: IChatHistory = {
          ...currentValue,
          history: [
            ...currentValue.history,
            {
              _id: Math.random().toString(),
              text: formValue.text,
              createdAt: new Date(),
              createdBy: {
                _id: me!._id,
              },
              chat: {
                _id: chatId,
              },
              status: IChatMessageStatus.Sending,
            } as unknown as IChatMessage,
          ],
        };
        return newValue;
      }
    );
    addMutation.mutate(formValue.text);
    reset();
    setTimeout(() => {
      onMessageSent();
    }, 100);
  };

  useEffect(() => {
    if (addMutation.isPending) return;
    inputRef?.current?.focus();
  }, [addMutation.isPending]);

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
