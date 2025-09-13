import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tamarind SACCO</title>
        <meta name="description" content="The SACCO for everyone" />
      </head>
      <body>
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>
            <Theme>{children}</Theme>
          </TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
