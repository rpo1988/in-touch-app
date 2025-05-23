"use client";

import { AUTH_CONFIG } from "@/app/configs/auth.config";
import { withoutProfile } from "@/hocs/withoutProfile";
import { useMe } from "@/providers/ProfileProvider";
import { IApiError } from "@/types/global.types";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormValue {
  username: string;
}

const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useMe();
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: {
      username: searchParams.get(AUTH_CONFIG.searchParamUsername) || "",
    },
  });
  const loginMutation = useMutation<void, AxiosError<IApiError>, string>({
    mutationFn: login,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      await loginMutation.mutateAsync(formValue.username);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    inputRef?.current?.focus();
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
          Log in
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
                error={loginMutation.isError || !!fieldState.error}
                helperText={
                  getApiErrorMessage(loginMutation.error) ||
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

        <Link href="/register" passHref legacyBehavior>
          <MtLink
            underline="hover"
            sx={{
              marginTop: 2,
            }}
          >
            Register
          </MtLink>
        </Link>
      </Paper>
    </Box>
  );
};

export default withoutProfile(LoginPage);
