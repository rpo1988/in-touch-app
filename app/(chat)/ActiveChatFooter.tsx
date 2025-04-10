import { useMe } from "@/providers/ProfileProvider";
import { sendMessage } from "@/services/chat.service";
import { Add, Mic, Send } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  text: string;
}

interface ActiveChatFooterProps {
  chatId: string;
}

export default function ActiveChatFooter({ chatId }: ActiveChatFooterProps) {
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
      reset();
      queryClient.invalidateQueries({
        queryKey: ["chat-history", me!._id, chatId],
      });
      inputRef?.current?.focus();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formValue: FormValue) => {
    if (addMutation.isPending || !isValid) return;

    addMutation.mutate(formValue.text);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

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
        <IconButton disabled={addMutation.isPending}>
          <Add />
        </IconButton>
        <Controller
          name="text"
          control={control}
          rules={{ required: "This field is required." }}
          disabled={addMutation.isPending}
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
        {addMutation.isPending ? (
          <span className="w-10 h-10 flex items-center justify-center">
            <CircularProgress size={24} />
          </span>
        ) : (
          <IconButton type={!text ? "button" : "submit"}>
            {!text ? <Mic /> : <Send />}
          </IconButton>
        )}
      </Box>
    </>
  );
}
