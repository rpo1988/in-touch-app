"use client";

import { queryClient } from "@/lib/query-client";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

const theme = createTheme({});

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
            {children}
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
