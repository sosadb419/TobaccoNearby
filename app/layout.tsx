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
    "Neutral, practical information for adults aged 18+ looking for tobacco shop locations, opening hours, directions, and contact details in Amsterdam.",
  keywords: [
    "tobacco shops Amsterdam",
    "Amsterdam tobacconist locations",
    "tobacco shop opening hours Amsterdam",
    "Amsterdam neighborhood directory"
  ],
  alternates: {
    canonical: "/"
  },
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
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TobaccoNearby",
    url: siteUrl,
    inLanguage: "en",
    audience: {
      "@type": "PeopleAudience",
      requiredMinAge: 18
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
