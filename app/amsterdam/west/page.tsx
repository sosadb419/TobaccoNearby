import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam West",
  description:
    "Find practical information about tobacco shops in Amsterdam West, including addresses, opening hours, directions, and accessibility notes where available."
};

export default async function WestPage() {
  const shops = await getShopsByNeighborhood("West");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam West"
      intro="Use this page to find practical information about tobacco shops in Amsterdam West, including addresses, opening hours, directions, and accessibility notes where available."
      shops={shops}
      searchHref="/search?neighborhood=West"
    />
  );
}
