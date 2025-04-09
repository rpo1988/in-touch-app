"use client";

import { withoutProfile } from "@/hocs/withoutProfile";
import { useMe } from "@/providers/ProfileProvider";
import { ApiError } from "@/types/global.types";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  username: string;
}

export default withoutProfile(function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { me, login } = useMe();
  const { replace } = useRouter();
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: {
      username: "",
    },
  });
  const loginMutation = useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: (username: string) => login(username),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      await loginMutation.mutateAsync(formValue.username);
      replace("/");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    inputRef?.current?.focus();
  }, [isLoading]);

  useEffect(() => {
    if (!!me) return replace("/");

    setIsLoading(false);
  }, [me, replace]);

  return (
    <Box className="w-full h-full flex items-center justify-center p-4">
      <Paper
        className="w-full max-w-[400px] flex flex-col gap-8 p-10"
        variant="outlined"
        sx={{
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" className="text-center">
          Log in
        </Typography>

        <form
          className="w-full flex flex-col gap-3"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="username"
            control={control}
            rules={{ required: "This field is required." }}
            disabled={isLoading}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                placeholder="Type your username"
                variant="outlined"
                size="small"
                autoComplete="off"
                error={loginMutation.isError || !!fieldState.error}
                helperText={
                  loginMutation.error?.response?.data.message ||
                  fieldState.error?.message
                }
                inputRef={inputRef}
              />
            )}
          />
          <Button
            type="submit"
            size="medium"
            variant="contained"
            className="min-h-10"
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              <>Continue</>
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
});
