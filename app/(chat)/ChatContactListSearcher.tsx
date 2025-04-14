import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  text?: string;
}

interface ChatContactListSearcherProps {
  onTextSubmitted: (text?: string) => void;
}

export default function ChatContactListSearcher({
  onTextSubmitted,
}: ChatContactListSearcherProps) {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      text: "",
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    onTextSubmitted(formValue.text);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <>
      <Box
        component="form"
        autoComplete="off"
        noValidate
        className="flex flex-row py-2 px-4 mt-2 gap-3 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Type a contact name"
              variant="outlined"
              size="small"
              className="grow"
              autoComplete="off"
              inputRef={inputRef}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </Box>
    </>
  );
}
