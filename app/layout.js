// app/layout.js
import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import MobileNavBar from '@/components/MobileNavBar';

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  metadataBase: new URL("https://hamroeshop.com"),
  title: "Hamro eShop - Best Online Shopping for Electronics, Fashion, Gadgets & More",
  description: "Hamro eShop is Nepal's leading online shopping platform for electronics, fashion, gadgets, home appliances, and more. Fast delivery, best prices, and exclusive deals for Nepali shoppers.",
  keywords: [
    "Hamro eShop", "ecommerce", "online shopping", "Nepal", "Nepali", "electronics", "fashion", "gadgets", "buy online", "best price", "deals", "discounts", "shop online", "mobile phones", "laptops", "home appliances", "Nepali store", "delivery Nepal", "online payment", "trusted shopping Nepal"
  ],
  openGraph: {
    title: "Hamro eShop - Best Online Shopping",
    description: "Shop electronics, fashion, gadgets, and more at Hamro eShop. Fast delivery and exclusive deals for Nepal.",
    url: "https://hamroeshop.com",
    siteName: "Hamro eShop",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Hamro eShop - Best Online Shopping"
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamro eShop - Best Online Shopping",
    description: "Shop electronics, fashion, gadgets, and more at Hamro eShop. Fast delivery and exclusive deals for Nepal.",
    images: ["/og.webp"],
    site: "@hamroeshop",
  },
  alternates: {
    canonical: "https://hamroeshop.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Shopping",
  applicationName: "Hamro eShop",
  creator: "Hamro eShop Team",
  publisher: "Hamro eShop Pvt. Ltd.",
  language: "en-NP",
  region: "NP",
  geo: {
    placename: "Nepal",
    position: "28.3949;84.1240",
  },
  business: {
    type: "OnlineStore",
    name: "Hamro eShop",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NP",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
    },
    telephone: "+977-9800000000",
    email: "support@hamroeshop.com",
    url: "https://hamroeshop.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Extra SEO tags */}
        <meta name="author" content="Hamro eShop" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="copyright" content="Hamro eShop" />
        <meta name="application-name" content="Hamro eShop" />
        <meta name="geo.region" content="NP" />
        <meta name="geo.placename" content="Nepal" />
        <meta name="geo.position" content="28.3949;84.1240" />
        <meta name="ICBM" content="28.3949, 84.1240" />
        <meta name="language" content="English, Nepali" />
        <meta name="country" content="Nepal" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="audience" content="all" />
        <meta name="subject" content="Online Shopping Nepal" />
        <meta name="coverage" content="Nepal" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="google-site-verification" content="RdmsfHygOvTqPu2BDP5uafy9IsTCcB_gZMiL1VQk3Kk" />
        {/* E-commerce structured data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Hamro eShop",
              url: "https://hamroeshop.com",
              logo: "https://hamroeshop.com/og.webp",
              description: "The best online shopping experience for electronics, fashion, gadgets, and more in Nepal.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "NP"
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61576989100945",
                "https://www.instagram.com/Hamro_e_shop"
              ]
            })
          }}
        />
        {/* Local business structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Hamro eShop",
              image: "https://hamroeshop.com/og.webp",
              "@id": "https://hamroeshop.com",
              url: "https://hamroeshop.com",
              telephone: "+977-9800000000",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Putalisadak",
                addressLocality: "Kathmandu",
                addressRegion: "Bagmati",
                postalCode: "44600",
                addressCountry: "NP"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 28.3949,
                longitude: 84.1240
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  opens: "09:00",
                  closes: "21:00"
                }
              ],
              sameAs: [
                "https://www.facebook.com/hamroeshop",
                "https://www.instagram.com/hamroeshop"
              ]
            })
          }}
        />
        {/* Favicon and manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Facebook Page and Google Site Verification */}
        <meta property="fb:page_id" content="61576989100945" />
        <meta property="og:see_also" content="https://www.facebook.com/profile.php?id=61576989100945" />
        <meta property="og:see_also" content="https://www.instagram.com/Hamro_e_shop" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />

        {/* Alternate language tags (if you support Nepali) */}
        <link rel="alternate" href="https://hamroeshop.com" hrefLang="en-np" />
        <link rel="alternate" href="https://hamroeshop.com/np" hrefLang="ne-np" />

        {/* Twitter Card for e-commerce */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hamroeshop" />
        <meta name="twitter:title" content="Hamro eShop - Best Online Shopping" />
        <meta name="twitter:description" content="Shop electronics, fashion, gadgets, and more at Hamro eShop. Fast delivery and exclusive deals for Nepal." />
        <meta name="twitter:image" content="https://hamroeshop.com/og.webp" />

        {/* Breadcrumb structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://hamroeshop.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "All Products",
                  "item": "https://hamroeshop.com/all-products"
                }
              ]
            })
          }}
        />

        {/* Site navigation structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": ["Home", "All Products", "Deals", "Contact"],
              "url": [
                "https://hamroeshop.com",
                "https://hamroeshop.com/all-products",
                "https://hamroeshop.com/deals",
                "https://hamroeshop.com/contact"
              ]
            })
          }}
        />
      </head>
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClerkProvider>
          <Toaster />
          <AppContextProvider>
            {children}
            <MobileNavBar />
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
