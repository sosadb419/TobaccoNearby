import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in De Pijp",
  description:
    "Find practical information about tobacco shops in De Pijp, including addresses, opening hours, directions, public transport notes, and contact details."
};

export default function DePijpPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in De Pijp"
      intro="Use this page to find practical information about tobacco shops in De Pijp, including addresses, opening hours, directions, and public transport notes where available."
      shops={getShopsByNeighborhood("De Pijp")}
      searchHref="/search?neighborhood=De%20Pijp"
    />
  );
}
