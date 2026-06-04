import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam West | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Amsterdam West, including opening hours, directions and nearby locations. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/west"
  }
};

const westFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam West?",
    answer:
      "Use this page to review Amsterdam West listings or search by street, neighborhood, postal code or nearby area."
  },
  {
    question: "Can I search near Oud-West, De Baarsjes, or Bos en Lommer?",
    answer:
      "Yes. Use the search bar for those area names or nearby streets when looking for relevant Amsterdam West listings."
  },
  {
    question: "Can I filter listings by opening hours?",
    answer:
      "Yes. The search page includes an open now filter when opening-hours data is available and valid."
  },
  {
    question: "Can I report outdated information?",
    answer:
      "Yes. Use the report or update options to suggest corrections. Submissions are reviewed before any listing changes."
  },
  {
    question: "Are all listings verified?",
    answer:
      "Some listings may show a verified badge. Even verified listings should be checked before visiting because details can change."
  }
];

export default async function WestPage() {
  const shops = await getShopsForArea("west");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam West"
      areaName="Amsterdam West"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam West. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam West includes areas such as Oud-West, De Baarsjes and Bos en Lommer. Use this page to review nearby shop locations, public transport context and practical contact details."
      practicalInfo={[
        "Amsterdam West listings may cover local shopping streets, residential areas and public transport routes.",
        "Areas such as Oud-West, De Baarsjes and Bos en Lommer can have varied opening hours by street and shop type.",
        "Use the map and listing cards to compare addresses, contact details, directions and accessibility information."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=West"
      faqs={westFaqs}
    />
  );
}
