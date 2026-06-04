import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Oost | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Amsterdam Oost, including opening hours, directions and nearby locations. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/oost"
  }
};

const oostFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam Oost?",
    answer:
      "Use this page for Amsterdam Oost listings or search by neighborhood, street, postal code or nearby public transport area."
  },
  {
    question: "Can I search near Oosterpark, Indische Buurt, or Watergraafsmeer?",
    answer:
      "Yes. Search by those area names or nearby streets to find matching listings where data is available."
  },
  {
    question: "Can I use the map to view listed shop locations?",
    answer:
      "Yes. When listings have valid coordinates, the map shows approximate shop locations for practical reference."
  },
  {
    question: "Can I check contact details before visiting?",
    answer:
      "Yes. Listings may include phone numbers and websites where available. Verify details directly before travelling."
  },
  {
    question: "How often is shop data reviewed?",
    answer:
      "Listings may include update or verification dates when available. Shop data can still change between reviews."
  }
];

export default async function OostPage() {
  const shops = await getShopsForArea("oost");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Oost"
      areaName="Amsterdam Oost"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Oost. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Oost includes areas such as Oosterpark, Indische Buurt and Watergraafsmeer. Listings can help users check practical location details and directions before travelling."
      practicalInfo={[
        "Amsterdam Oost covers several residential and commercial areas, so listings are grouped by practical shop location details.",
        "Public transport access may include tram, bus, metro or train connections depending on the exact street.",
        "Opening hours and contact details should be checked before visiting, especially around holidays or temporary closures."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Oost"
      faqs={oostFaqs}
    />
  );
}
