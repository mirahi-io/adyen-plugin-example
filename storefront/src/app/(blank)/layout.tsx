import "@adyen/adyen-web/dist/adyen.css";

export const metadata = {
  title: "Payment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
