"use client";

import { ProfileProvider } from "@/providers/ProfileProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

const theme = createTheme({});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
  },
});

export default function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Box component="main" className="w-screen h-screen">
            <ProfileProvider>
              <SocketProvider>{children}</SocketProvider>
            </ProfileProvider>
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
