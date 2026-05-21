import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Oost",
  description:
    "Find practical information about tobacco shops in Amsterdam Oost, including addresses, opening hours, directions, and nearby public transport where available."
};

export default async function OostPage() {
  const shops = await getShopsByNeighborhood("Oost");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Oost"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Oost, including addresses, opening hours, directions, and nearby public transport where available."
      shops={shops}
      searchHref="/search?neighborhood=Oost"
    />
  );
}
