import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForArea } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Zuid | TobaccoNearby"
  },
  description:
    "Search tobacco shops in Amsterdam Zuid with practical information including addresses, opening hours, directions, and contact details.",
  alternates: {
    canonical: "/amsterdam/zuid"
  }
};

const zuidFaqs = [
  {
    question: "How can I find tobacco shops in Amsterdam Zuid?",
    answer:
      "Use this page to review Amsterdam Zuid listings or search by neighborhood, postal code, street or nearby station area."
  },
  {
    question: "Can I search near Museumkwartier, Rivierenbuurt, or Buitenveldert?",
    answer:
      "Yes. Use those area names or nearby streets in the search bar when looking for Amsterdam Zuid listings."
  },
  {
    question: "Can I search by postal code?",
    answer:
      "Yes. The search page can match postal codes when that data is available for listed shops."
  },
  {
    question: "Can I check accessibility information?",
    answer:
      "Yes. Listings may show wheelchair accessibility information where available. Unknown details should be verified before visiting."
  },
  {
    question: "Does TobaccoNearby promote smoking?",
    answer:
      "No. TobaccoNearby is a neutral directory for adults aged 18+ and does not encourage tobacco use."
  }
];

export default async function ZuidPage() {
  const shops = await getShopsForArea("zuid");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Zuid"
      areaName="Amsterdam Zuid"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Zuid. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Zuid includes areas such as Museumkwartier, Rivierenbuurt and Buitenveldert. Listings can be reviewed for practical shop locations, opening hours and directions."
      practicalInfo={[
        "Amsterdam Zuid includes residential, business and cultural areas, so shop locations may be spread across several districts.",
        "Users may want to verify travel details around Amsterdam Zuid station, tram routes and local shopping streets.",
        "Opening hours, contact details and accessibility information can vary by listing and should be confirmed before visiting."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=Zuid"
      faqs={zuidFaqs}
    />
  );
}
