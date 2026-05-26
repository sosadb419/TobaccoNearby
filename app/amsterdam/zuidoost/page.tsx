import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Zuidoost | TobaccoNearby"
  },
  description:
    "Find listed tobacco shops in Amsterdam Zuidoost, including Bijlmer and surrounding areas, with practical location and opening hour information.",
  alternates: {
    canonical: "/amsterdam/zuidoost"
  }
};

const zuidoostFaqs = [
  {
    question: "Can I find tobacco shops near Bijlmer ArenA?",
    answer:
      "Use this Zuidoost page or search for Bijlmer to find relevant listings where shop data is available."
  },
  {
    question: "How can I search in Amsterdam Zuidoost?",
    answer:
      "Search by Zuidoost, Bijlmer, street name, postal code or nearby transport area to narrow the results."
  },
  {
    question: "Can I search by \"Bijlmer\"?",
    answer:
      "Yes. Bijlmer is treated as a Zuidoost-related search term where matching listings are available."
  },
  {
    question: "Can I use directions from the listing?",
    answer:
      "Yes. Listings may include a directions link to open route information in Google Maps."
  },
  {
    question: "How can I suggest a correction?",
    answer:
      "Use the report or update option on the website. Submitted suggestions are reviewed before changes are made."
  }
];

export default async function ZuidoostPage() {
  const shops = await getShopsForArea("zuidoost");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Zuidoost"
      areaName="Amsterdam Zuidoost"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Zuidoost. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Zuidoost includes Bijlmer, the ArenA area and surrounding neighborhoods. Use this page to check listed shop locations, opening hours and directions before visiting."
      practicalInfo={[
        "Zuidoost listings include Amsterdam Zuidoost records and Bijlmer-related shop information where available.",
        "Travel options may include metro, train, bus or local routes around Bijlmer and the ArenA area.",
        "Please verify opening hours and contact details before visiting, especially when travelling from another part of Amsterdam."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Zuidoost"
      faqs={zuidoostFaqs}
    />
  );
}
