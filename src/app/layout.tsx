'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { metadata } from './metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSidebarToggle = (open: boolean) => setIsSidebarOpen(open);

  const isLoginPage =
    typeof window !== 'undefined' && window.location.pathname === '/';

  return (
    <html lang="en">
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isLoginPage && <Sidebar onToggle={handleSidebarToggle} />}
        <main
          className={`p-4 transition-all duration-300 ${
            !isLoginPage && isSidebarOpen ? 'md:pl-72' : 'md:pl-24'
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
