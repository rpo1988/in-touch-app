import { useMe } from "@/providers/ProfileProvider";
import { addContact } from "@/services/user.service";
import { ApiError, IUser } from "@/types/global.types";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  text: string;
}

interface ChatContactNewProps {
  onClose: () => void;
  onCreated: (contactId: string) => void;
}

export default function ChatContactNew({
  onClose,
  onCreated,
}: ChatContactNewProps) {
  const queryClient = useQueryClient();
  const { me } = useMe();
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: {
      text: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const addContactMutation = useMutation<IUser[], AxiosError<ApiError>, string>(
    {
      mutationFn: (text: string) => addContact(me!._id, text),
      onSuccess: async (newContacts, text) => {
        await queryClient.invalidateQueries({
          queryKey: ["contacts", me!._id],
        });
        const newContact = newContacts.find(
          (contact) => contact.username === text
        )!;
        onCreated(newContact._id);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    addContactMutation.mutate(formValue.text);
  };

  useEffect(() => {
    if (addContactMutation.isPending) return;
    inputRef.current?.focus();
  }, [addContactMutation.isPending]);

  return (
    <>
      <Toolbar className="flex flex-row gap-2.5">
        <IconButton edge="start" onClick={onClose}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          New Contact
        </Typography>
      </Toolbar>
      <Divider />

      <div className="w-full flex flex-col mt-10 px-4 items-center">
        <div className="w-full flex flex-col gap-3 max-w-[300px]">
          <Typography variant="h5" component="div" className="text-center">
            Adding a New Contact
          </Typography>

          <Box
            component="form"
            autoComplete="off"
            noValidate
            className="w-full flex flex-col mt-2 gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="text"
              control={control}
              rules={{ required: "This field is required." }}
              disabled={addContactMutation.isPending}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Type the contact username"
                  variant="outlined"
                  size="small"
                  className="grow"
                  autoComplete="off"
                  error={addContactMutation.isError || !!fieldState.error}
                  helperText={
                    addContactMutation.error?.response?.data.message ||
                    fieldState.error?.message
                  }
                  inputRef={inputRef}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={addContactMutation.isPending}
            >
              {addContactMutation.isPending ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <>Add contact</>
              )}
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
