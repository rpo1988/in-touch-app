import { useMe } from "@/providers/ProfileProvider";
import { sendMessage } from "@/services/chat.service";
import { Add, Mic, Send } from "@mui/icons-material";
import {
  CircularProgress,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  text: string;
}

interface ActiveChatFooterProps {
  chatId: string;
}

export default function ActiveChatFooter({ chatId }: ActiveChatFooterProps) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const formMethods = useForm<FormValue>({
    defaultValues: {
      text: "",
    },
  });
  const text = formMethods.watch("text");
  const inputRef = useRef<HTMLInputElement>(null);

  const addMutation = useMutation({
    mutationFn: (text: string) => sendMessage(me!._id, chatId, text),
    onSuccess: () => {
      formMethods.reset();
      queryClient.invalidateQueries({
        queryKey: ["chat-history"],
      });
      inputRef?.current?.focus();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formValue: FormValue) => {
    if (addMutation.isPending) return;

    addMutation.mutate(formValue.text);
  };

  useEffect(() => {
    console.log("INIT");
    inputRef?.current?.focus();
    return () => {
      console.log("FIN");
    };
  }, []);

  return (
    <>
      <Divider />
      <form
        className="bg-gray-50 flex flex-row py-2 px-4 gap-3 items-center"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <IconButton disabled={addMutation.isPending}>
          <Add />
        </IconButton>
        <TextField
          placeholder="Type a message"
          variant="outlined"
          className="grow"
          sx={{
            bgcolor: "white",
          }}
          {...formMethods.register("text")}
          disabled={addMutation.isPending}
          autoComplete="off"
          inputRef={inputRef}
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
      </form>
    </>
  );
}
