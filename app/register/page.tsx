"use client";

import { AUTH_CONFIG } from "@/app/configs/auth.config";
import { withoutProfile } from "@/hocs/withoutProfile";
import { signup } from "@/services/auth.service";
import { IApiError, IUser } from "@/types/global.types";
import { getApiErrorMessage } from "@/utils/api";
import {
  Box,
  Button,
  CircularProgress,
  Link as MtLink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  username: string;
  name: string;
  statusInfo?: string;
}

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { replace } = useRouter();
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: {
      username: "",
      name: "",
      statusInfo: "",
    },
  });
  const registerMutation = useMutation<IUser, AxiosError<IApiError>, FormValue>(
    {
      mutationFn: signup,
    }
  );
  const usernameRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      await registerMutation.mutateAsync(formValue);
      replace(
        `/login?${AUTH_CONFIG.searchParamUsername}=${formValue.username}`
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    usernameRef?.current?.focus();
  }, [isLoading]);

  return (
    <Box
      className="w-full h-full flex items-center justify-center p-6"
      sx={{
        bgcolor: blueGrey[50],
      }}
    >
      <Paper
        className="w-full max-w-[400px] flex flex-col px-4 py-6 sm:p-10"
        elevation={4}
        sx={{
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" className="text-center">
          Register
        </Typography>

        <form
          className="w-full flex flex-col gap-3 mt-8"
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
                label="Username"
                placeholder="Type your username"
                variant="outlined"
                autoComplete="off"
                error={registerMutation.isError || !!fieldState.error}
                helperText={
                  getApiErrorMessage(registerMutation.error) ||
                  fieldState.error?.message
                }
                inputRef={usernameRef}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{ required: "This field is required." }}
            disabled={isLoading}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                placeholder="Type your name"
                variant="outlined"
                autoComplete="off"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="statusInfo"
            control={control}
            disabled={isLoading}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Status Info"
                placeholder="Type your status info for others to see it"
                variant="outlined"
                multiline
                rows={4}
                autoComplete="off"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
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

        <Link href="/login" passHref legacyBehavior>
          <MtLink
            underline="hover"
            sx={{
              marginTop: 2,
            }}
          >
            Login
          </MtLink>
        </Link>
      </Paper>
    </Box>
  );
};

export default withoutProfile(RegisterPage);
