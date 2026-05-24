import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Noord | TobaccoNearby"
  },
  description:
    "View tobacco shop listings in Amsterdam Noord with address details, opening hours, map directions, and contact information where available.",
  alternates: {
    canonical: "/amsterdam/noord"
  }
};

const noordFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam Noord?",
    answer:
      "Use this page to review Amsterdam Noord listings, or search by area, street, postal code, ferry stop or metro context."
  },
  {
    question: "Can I search near metro or ferry connections?",
    answer:
      "Yes. Listings may include public transport notes, and the search page can match relevant area or station terms where available."
  },
  {
    question: "Can I get directions from the listings?",
    answer:
      "Yes. If a listing includes a maps link, the directions button opens route information in Google Maps."
  },
  {
    question: "Are opening hours guaranteed?",
    answer:
      "No. Opening hours can change. Verify hours and contact details directly before visiting."
  },
  {
    question: "Can users directly edit shop listings?",
    answer:
      "No. Visitors can only submit correction suggestions. Updates are reviewed before published listings are changed."
  }
];

export default async function NoordPage() {
  const shops = await getShopsByNeighborhood("Noord");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Noord"
      areaName="Amsterdam Noord"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Noord. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Noord includes neighborhoods north of the IJ, with ferry, bus and metro connections depending on the area. Use the listings for practical address, opening hour and direction checks."
      practicalInfo={[
        "Amsterdam Noord shop locations may be reached by ferry, metro, bus, bicycle or car depending on the neighborhood.",
        "Check directions carefully because travel routes can differ between Noord ferry areas, metro stations and residential streets.",
        "Listings show contact details, websites and accessibility information when those details are available."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Noord"
      faqs={noordFaqs}
    />
  );
}
