import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Oost | TobaccoNearby"
  },
  description:
    "Find practical information about tobacco shop locations in Amsterdam Oost, including addresses, opening hours, and directions.",
  alternates: {
    canonical: "/amsterdam/oost"
  }
};

export default async function OostPage() {
  const shops = await getShopsByNeighborhood("Oost");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Oost"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Oost. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Oost includes areas such as Oosterpark, Indische Buurt and Watergraafsmeer. Listings can help users check practical location details and directions before travelling."
      shops={shops}
      searchHref="/search?neighborhood=Oost"
    />
  );
}
