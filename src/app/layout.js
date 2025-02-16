'use client' // Layout must be a client component

import { SessionProvider } from "next-auth/react";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
