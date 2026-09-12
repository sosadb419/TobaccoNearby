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
    "Find practical location information for tobacco shops, kiosks and gas stations in supported Dutch cities, including Amsterdam and Utrecht. Adults 18+ only.",
  keywords: [
    "tobacco shops Amsterdam",
    "tobacco shops Utrecht",
    "Amsterdam tobacconist locations",
    "Utrecht tobacconist locations",
    "tobacco shop opening hours Netherlands"
  ],
  openGraph: {
    title: "TobaccoNearby",
    description:
      "Find practical location information for tobacco shops, kiosks and gas stations in supported Dutch cities, including Amsterdam and Utrecht. Adults 18+ only.",
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
