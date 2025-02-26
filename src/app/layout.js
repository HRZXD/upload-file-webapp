// filepath: /C:/Users/HRZ/Desktop/Projects/Github Clone/upload-file-webapp/src/app/layout.js
'use client'; // Layout must be a client component

import { Noto_Sans_Thai } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'], // Ensures Thai characters load properly
  weight: ['400', '700'], // Choose the required weights
  variable: '--font-noto-sans-thai' // Optional: Define a CSS variable
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSansThai.className}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}