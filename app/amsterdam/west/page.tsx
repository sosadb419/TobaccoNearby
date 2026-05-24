import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam West | TobaccoNearby"
  },
  description:
    "Search listed tobacco shops in Amsterdam West by location, opening hours, directions, and available contact information.",
  alternates: {
    canonical: "/amsterdam/west"
  }
};

export default async function WestPage() {
  const shops = await getShopsByNeighborhood("West");

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
    />
  );
}
