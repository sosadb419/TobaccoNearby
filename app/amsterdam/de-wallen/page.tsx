import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops near De Wallen Amsterdam | TobaccoNearby"
  },
  description:
    "Find practical information about tobacco shop locations near De Wallen in Amsterdam, including addresses, opening hours, and directions. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/de-wallen"
  }
};

export default async function DeWallenPage() {
  const shops = await getShopsByNeighborhood("Centrum");

  return (
    <NeighborhoodPage
      title="Tobacco Shops near De Wallen Amsterdam"
      intro="This page provides neutral, practical information about listed tobacco shops near De Wallen in Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="De Wallen is centrally located in Amsterdam. This page treats nearby Centrum listings as relevant area information and focuses only on practical details such as addresses, opening hours and directions."
      shops={shops}
      searchHref="/search?neighborhood=De%20Wallen"
      mapNote="De Wallen is handled as a central Amsterdam area. Please verify exact shop details before visiting."
    />
  );
}
