import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Diemen | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Diemen, including opening hours, directions and nearby locations. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/diemen"
  }
};

const diemenFaqs = [
  {
    question: "How can I find tobacco shops in Diemen?",
    answer:
      "Use this page to review listed Diemen shop locations, or search by Diemen Centrum, Diemen Zuid, Diemen Noord or nearby station terms."
  },
  {
    question: "Is Diemen shown separately from Amsterdam areas?",
    answer:
      "Yes. Diemen is handled as a nearby municipality next to Amsterdam, with practical listings shown where data is available."
  },
  {
    question: "Can I get directions to Diemen listings?",
    answer:
      "Yes. Listings may include directions links that open route information in Google Maps where available."
  },
  {
    question: "Are shop details verified before visiting?",
    answer:
      "Shop data may change. Verify opening hours, contact details and accessibility information before visiting."
  },
  {
    question: "Does TobaccoNearby sell tobacco products?",
    answer:
      "No. TobaccoNearby is a neutral informational directory only and does not sell products or promote smoking."
  }
];

export default async function DiemenPage() {
  const shops = await getShopsForArea("diemen");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Diemen"
      areaName="Diemen"
      intro="This page provides neutral, practical information about listed tobacco shops in Diemen. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Diemen is a municipality next to Amsterdam, with areas such as Diemen Centrum, Diemen Zuid and Diemen Noord. Use this page to check practical location details, opening hours and directions where available."
      practicalInfo={[
        "Diemen listings may include locations around Diemen Centrum, Diemen Zuid, Diemen Noord, Diemen Sniep and nearby station areas.",
        "Travel routes can differ depending on whether a listing is closer to Diemen station, Diemen Zuid or residential streets.",
        "Use listing cards to review addresses, opening hours, directions, contact details and accessibility information where available."
      ]}
      shops={shops}
      searchHref="/search?q=Diemen"
      faqs={diemenFaqs}
    />
  );
}
