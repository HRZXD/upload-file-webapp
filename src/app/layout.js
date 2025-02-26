'use client';
import { useEffect } from 'react';
import { Noto_Sans_Thai } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-thai'
});

export default function RootLayout({ children }) {
  useEffect(() => {
    document.title = "NoByte"; // ✅ Manually update the title
  }, []);

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
