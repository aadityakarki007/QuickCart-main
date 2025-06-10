// app/layout.js
import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import MobileNavBar from '@/components/MobileNavBar';  // Import the navbar component

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  metadataBase: new URL("https://hamroeshop.com"),
  title: "Hamro eShop - Your choice to buy",
  description: "Hamro eShop - Your choice to buy. The best online shopping experience.",
  openGraph: {
    title: "Hamro eShop - Your choice to buy",
    description: "EShop - The best online shopping experience in Nepal.",
    url: "https://hamroeshop.com",
    siteName: "Hamro eShop",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Hamro eShop - Your best shopping partner"
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamro eShop - Your choice to buy",
    description: "Hamro eShop - The best shopping experience in Nepal.",
    images: ["/og.webp"],
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
            <MobileNavBar />  {/* Add MobileNavBar here */}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
