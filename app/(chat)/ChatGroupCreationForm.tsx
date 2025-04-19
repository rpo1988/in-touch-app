import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  title: string;
  description?: string;
}

interface ChatGroupCreationFormProps {
  open: boolean;
  defaultValues: {
    title: "";
    description: "";
  };
  onCancel: () => void;
  onContinue: (data: FormValue) => void;
}

export default function ChatGroupCreationForm({
  open,
  defaultValues,
  onCancel,
  onContinue,
}: ChatGroupCreationFormProps) {
  const {
    control,
    formState: { isValid },
    reset,
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues,
  });
  const titleInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    onContinue(formValue);
  };

  useEffect(() => {
    if (!open || !titleInputRef.current) return;

    titleInputRef.current.focus();
    reset();
  }, [open, reset]);

  return (
    <>
      <Box
        component="form"
        autoComplete="off"
        noValidate
        className="flex flex-col p-4 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="title"
          control={control}
          rules={{
            required: "This field is required.",
            minLength: {
              value: 3,
              message: "This field must be at least 3 characters long.",
            },
            maxLength: {
              value: 50,
              message: "This field cannot exceed 50 characters.",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title"
              placeholder="Type a title"
              variant="outlined"
              autoComplete="off"
              inputRef={titleInputRef}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: {
              value: 250,
              message: "This field cannot exceed 250 characters.",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Description"
              placeholder="Type a description"
              variant="outlined"
              autoComplete="off"
              multiline
              rows={4}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <div className="flex flex-row gap-3 self-end">
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Select Members
          </Button>
        </div>
      </Box>
    </>
  );
}
