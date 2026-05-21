import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tobacco Shops in De Pijp",
  description:
    "Find practical information about tobacco shops in De Pijp, including addresses, opening hours, directions, public transport notes, and contact details."
};

export default async function DePijpPage() {
  const shops = await getShopsByNeighborhood("De Pijp");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in De Pijp"
      intro="Use this page to find practical information about tobacco shops in De Pijp, including addresses, opening hours, directions, and public transport notes where available."
      shops={shops}
      searchHref="/search?neighborhood=De%20Pijp"
    />
  );
}
