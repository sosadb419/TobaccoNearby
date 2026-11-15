import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TobaccoNearby | Netherlands Tobacco Shop Map & Directions",
    template: "%s | TobaccoNearby"
  },
  description:
    "Find practical location information for published tobacco shop, kiosk and gas station listings in Amsterdam, Utrecht and Rotterdam. Adults 18+ only.",
  keywords: [
    "tobacco shops Amsterdam",
    "tobacco shops Utrecht",
    "tobacco shops Rotterdam",
    "Amsterdam tobacconist locations",
    "Utrecht tobacconist locations",
    "Rotterdam tobacconist locations",
    "tobacco shop opening hours Netherlands"
  ],
  openGraph: {
    title: "TobaccoNearby",
    description:
      "Find practical location information for published tobacco shop, kiosk and gas station listings in Amsterdam, Utrecht and Rotterdam. Adults 18+ only.",
    url: SITE_URL,
    siteName: "TobaccoNearby",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8466194473351664"
        />
      </head>
      <body>
        <AgeGate />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
