import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

const siteUrl = "https://tobacconearby.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TobaccoNearby | Find Tobacco Shops Near You in Amsterdam",
    template: "%s | TobaccoNearby"
  },
  description:
    "Search for practical information about tobacco shop locations in Amsterdam, including addresses, opening hours, directions and accessibility details. Adults 18+ only.",
  keywords: [
    "tobacco shops Amsterdam",
    "Amsterdam tobacconist locations",
    "tobacco shop opening hours Amsterdam",
    "Amsterdam neighborhood directory"
  ],
  openGraph: {
    title: "TobaccoNearby",
    description:
      "Find practical location information for tobacco shops in Amsterdam. Adults aged 18+ only.",
    url: siteUrl,
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
