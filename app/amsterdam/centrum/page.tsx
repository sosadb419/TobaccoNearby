import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Centrum | TobaccoNearby"
  },
  description:
    "Find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and contact details. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/centrum"
  }
};

const centrumFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam Centrum?",
    answer:
      "Use this page to review listed shop locations in Centrum, or search by street, area name, postal code or nearby public transport point."
  },
  {
    question: "Are tobacco shops in Amsterdam Centrum open late?",
    answer:
      "Opening hours vary by listing and may change. Check the listed hours and verify directly with the shop before visiting."
  },
  {
    question: "Can I find shops near public transport in Centrum?",
    answer:
      "Listings may include nearby public transport notes, including tram, metro, bus or Amsterdam Central Station context where available."
  },
  {
    question: "Does TobaccoNearby show directions for Centrum listings?",
    answer:
      "Yes. Listings may include a directions link that opens the shop location in Google Maps where available."
  },
  {
    question: "How accurate are opening hours?",
    answer:
      "Shop data may change because of holidays, events or temporary closures. Verify opening hours before travelling."
  }
];

export default async function CentrumPage() {
  const shops = await getShopsByNeighborhood("Centrum");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Centrum"
      areaName="Amsterdam Centrum"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Centrum. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Centrum covers central Amsterdam, including streets around Damrak, Dam Square, Nieuwezijds Voorburgwal and nearby public transport stops. Use this page to check practical details before travelling through the city centre."
      practicalInfo={[
        "Central Amsterdam can be busy during weekends, events and holidays, so checking opening hours before visiting is important.",
        "Public transport access may include Amsterdam Central Station, metro stops, tram routes and nearby bus stops depending on the listing.",
        "Listings focus on address details, directions, contact information and accessibility notes where available."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Centrum"
      mapNote="Centrum listings may be close to major transit points, but opening hours can vary during holidays and events."
      faqs={centrumFaqs}
    />
  );
}
