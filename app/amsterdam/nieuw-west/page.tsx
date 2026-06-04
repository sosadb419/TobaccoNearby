import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Nieuw-West | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Amsterdam Nieuw-West, including opening hours, directions and nearby locations. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/nieuw-west"
  }
};

const nieuwWestFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam Nieuw-West?",
    answer:
      "Use this page to review listed shop locations in Nieuw-West, or search by area names such as Osdorp, Slotervaart, Slotermeer or Lelylaan."
  },
  {
    question: "Can I search near Osdorp or Slotervaart?",
    answer:
      "Yes. The search page can match common Nieuw-West area names and street or transport terms where listing data is available."
  },
  {
    question: "Are opening hours always accurate?",
    answer:
      "Opening hours may change because of holidays, temporary closures or local conditions. Verify details before visiting."
  },
  {
    question: "Can I get directions to listed shops?",
    answer:
      "Yes. Listings may include a directions link that opens route information in Google Maps where available."
  },
  {
    question: "Can I suggest a correction?",
    answer:
      "Yes. Use the report or update options on the website to submit a correction suggestion for review."
  }
];

export default async function NieuwWestPage() {
  const shops = await getShopsForArea("nieuw-west");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Nieuw-West"
      areaName="Amsterdam Nieuw-West"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Nieuw-West. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Nieuw-West includes areas such as Osdorp, Slotervaart, Slotermeer, Geuzenveld, De Aker and routes around Lelylaan. Use this page to check practical shop location details before travelling."
      practicalInfo={[
        "Nieuw-West covers several residential and commercial areas, so route planning can vary by neighborhood.",
        "Search terms such as Osdorp, Slotervaart, Slotermeer, Geuzenveld, De Aker, Nieuw Sloten and Lelylaan may help narrow listings.",
        "Listings focus on addresses, opening hours, directions, contact details and accessibility information where available."
      ]}
      shops={shops}
      searchHref="/search?q=Nieuw-West"
      faqs={nieuwWestFaqs}
    />
  );
}
