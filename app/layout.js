import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import { headers } from 'next/headers';

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "EShop - Your choice to buy",
  description: "EShop - Your choice to buy. The best online shopping experience.",
};

export default async function RootLayout({ children }) {
  // Get headers for Clerk to handle server components properly
  const headersList = headers();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClerkProvider headers={headersList}>
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
