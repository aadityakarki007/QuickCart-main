// app/layout.js
import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "EShop - Your choice to buy",
  description: "EShop - Your choice to buy. The best online shopping experience.",
  openGraph: {
    title: "EShop - Your choice to buy",
    description: "EShop - Your choice to buy. The best online shopping experience.",
    url: "https://hamroeshop.com",
    siteName: "EShop",
    images: [
      {
        url: "https://hamroeshop.com/assets/og.png", // Make sure this image exists and is publicly accessible
        width: 1200,
        height: 630,
        alt: "EShop Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EShop - Your choice to buy",
    description: "EShop - Your choice to buy. The best online shopping experience.",
    images: ["https://hamroeshop.com/assets/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClerkProvider>
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
