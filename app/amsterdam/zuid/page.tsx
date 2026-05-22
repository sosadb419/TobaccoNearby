import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

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

export default async function ZuidPage() {
  const shops = await getShopsByNeighborhood("Zuid");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Zuid"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Zuid. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Zuid includes areas such as Museumkwartier, Rivierenbuurt and Buitenveldert. Listings can be reviewed for practical shop locations, opening hours and directions."
      shops={shops}
      searchHref="/search?neighborhood=Zuid"
    />
  );
}
