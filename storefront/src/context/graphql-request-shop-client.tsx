"use client";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { GraphQLClient } from "graphql-request";

const GraphQLClientContext = createContext<GraphQLClient>(
  new GraphQLClient("http://localhost:3000/shop-api", { credentials: "include" })
);

export function GraphQLClientProvider({ children }: { children: ReactNode }) {
  const client = new GraphQLClient("http://localhost:3000/shop-api", { credentials: "include" });
  return <GraphQLClientContext.Provider value={client}>{children}</GraphQLClientContext.Provider>;
}

/** Shortcut hook to access `GraphQLClientContext` (same as `useContext(GraphQLClientContext)`) */
export function useGraphQLClient() {
  return useContext(GraphQLClientContext);
}
