import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Zuid",
  description:
    "Find practical information about tobacco shops in Amsterdam Zuid, including addresses, opening hours, directions, and accessibility notes."
};

export default async function ZuidPage() {
  const shops = await getShopsByNeighborhood("Zuid");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Zuid"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Zuid, including addresses, opening hours, directions, and accessibility notes where available."
      shops={shops}
      searchHref="/search?neighborhood=Zuid"
    />
  );
}
