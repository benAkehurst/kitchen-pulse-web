'use client';

import { Lato } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Layout/Sidebar';
import { useState } from 'react';
import { metadata } from './metadata';
import { usePathname } from 'next/navigation';

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Sidebar should only hide on the "/" route
  const isLoginPage = pathname === '/';

  const handleSidebarToggle = (open: boolean) => setIsSidebarOpen(open);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className={`${lato.className} antialiased`}>
        {/* Show Sidebar only when not on the login page */}
        {!isLoginPage && <Sidebar onToggle={handleSidebarToggle} />}
        <main
          className={`transition-all duration-300 pt-6 ${
            !isLoginPage && isSidebarOpen
              ? 'md:pl-80 md:pr-6'
              : 'md:pl-24 md:pr-6'
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
