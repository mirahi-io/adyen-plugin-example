"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // Initialization with a function guarantees that the same ref is used after each rerender.
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
// See: https://tanstack.com/query/latest/docs/react/guides/ssr#queryclientprovider-is-required-by-both-the-initialdata-and-hydrate-prefetching-approaches
