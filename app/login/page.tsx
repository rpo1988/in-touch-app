"use client";

import { withoutProfile } from "@/hocs/withoutProfile";
import { useMe } from "@/providers/ProfileProvider";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  username: string;
}

export default withoutProfile(function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const { me, login } = useMe();
  const { replace } = useRouter();
  const formMethods = useForm<FormValue>({
    defaultValues: {
      username: "67f0ace5458efc03732814cc", // TODO: Remove default value once test is finished
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (formValue: FormValue) => {
    try {
      setIsLoading(true);
      await login(formValue.username);
      replace("/");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!!me) replace("/");

    setIsLoading(false);
    inputRef?.current?.focus();
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
          onSubmit={formMethods.handleSubmit(onSubmit)}
        >
          <TextField
            placeholder="Type your username"
            variant="outlined"
            size="small"
            {...formMethods.register("username")}
            disabled={isLoading}
            autoComplete="off"
            inputRef={inputRef}
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
