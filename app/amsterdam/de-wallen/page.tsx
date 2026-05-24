import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForDeWallen } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops near De Wallen Amsterdam | TobaccoNearby"
  },
  description:
    "Find practical information about tobacco shop locations near De Wallen in Amsterdam, including addresses, opening hours, and directions. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/de-wallen"
  }
};

const deWallenFaqs = [
  {
    question: "How can I find tobacco shops near De Wallen?",
    answer:
      "Use this page to review listings near De Wallen. If exact area data is unavailable, relevant Centrum listings may be shown."
  },
  {
    question: "Are listings near De Wallen part of Amsterdam Centrum?",
    answer:
      "De Wallen is a central Amsterdam area, so Centrum listings may be relevant when exact De Wallen records are not available."
  },
  {
    question: "Can I get directions to shops near De Wallen?",
    answer:
      "Yes. Listings may include a Google Maps directions link where map data is available."
  },
  {
    question: "Why should I verify shop details before visiting?",
    answer:
      "Opening hours, contact details and accessibility information may change. Verify important details directly with the shop."
  },
  {
    question: "Is TobaccoNearby a promotional website?",
    answer:
      "No. TobaccoNearby is a neutral informational directory for adults aged 18+ and does not promote smoking."
  }
];

export default async function DeWallenPage() {
  const shops = await getShopsForDeWallen();

  return (
    <NeighborhoodPage
      title="Tobacco Shops near De Wallen Amsterdam"
      areaName="De Wallen Amsterdam"
      intro="This page provides neutral, practical information about listed tobacco shops near De Wallen in Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="De Wallen is centrally located in Amsterdam, near streets such as Oudezijds Voorburgwal, Oudezijds Achterburgwal and surrounding Centrum routes. This page focuses only on practical shop location details."
      practicalInfo={[
        "If exact De Wallen listings are unavailable, this page shows relevant Centrum listings as nearby central Amsterdam information.",
        "Central streets can be busy, so users should verify shop hours and directions before travelling.",
        "Listings are limited to practical information such as address, contact details, accessibility notes and map directions."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=De%20Wallen"
      mapNote="De Wallen is handled as a central Amsterdam area. Please verify exact shop details before visiting."
      faqs={deWallenFaqs}
    />
  );
}
