import { GraphQLClientProvider } from "@/context/graphql-request-shop-client";
import { ReactQueryProvider } from "@/context/react-query-provider";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const titillium = Titillium_Web({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Vendure storefront",
  description: "A simple example storefront built with Next.js and Vendure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <GraphQLClientProvider>
          <body className={titillium.className}>{children}</body>
        </GraphQLClientProvider>
      </ReactQueryProvider>
    </html>
  );
}
