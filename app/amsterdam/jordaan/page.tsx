import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Jordaan Amsterdam | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Jordaan Amsterdam, including opening hours, directions and nearby locations. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/jordaan"
  }
};

const jordaanFaqs = [
  {
    question: "How can I find tobacco shops in the Jordaan?",
    answer:
      "Use this page to review listed Jordaan shop locations or search by nearby streets, postal code or neighborhood name."
  },
  {
    question: "Can I search near Westerstraat or Rozengracht?",
    answer:
      "Yes. The search page can match street and area terms such as Westerstraat, Rozengracht and Noordermarkt where listing data is available."
  },
  {
    question: "Are opening hours always accurate?",
    answer:
      "Opening hours may change without notice. Verify hours and contact details directly before visiting."
  },
  {
    question: "Can I report incorrect information for a Jordaan listing?",
    answer:
      "Yes. Use the report option on the shop detail page to submit a correction suggestion for review."
  },
  {
    question: "Does TobaccoNearby sell tobacco products?",
    answer:
      "No. TobaccoNearby does not sell products or process orders. It only provides practical directory information."
  }
];

export default async function JordaanPage() {
  const shops = await getShopsForArea("jordaan");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Jordaan Amsterdam"
      areaName="Jordaan Amsterdam"
      intro="This page provides neutral, practical information about listed tobacco shops in the Jordaan area of Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="The Jordaan area includes local streets such as Westerstraat, Rozengracht and routes around Noordermarkt. Use listed shop information to check addresses, opening hours and directions."
      practicalInfo={[
        "Jordaan streets can be narrow and busy, so route planning and opening-hour checks can help avoid unnecessary travel.",
        "Listings may include public transport context around tram and bus stops near Marnixstraat, Rozengracht or nearby canals.",
        "Contact details and websites are shown where available so users can verify details directly before visiting."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Jordaan"
      faqs={jordaanFaqs}
    />
  );
}
