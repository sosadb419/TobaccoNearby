import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Oost",
  description:
    "Find practical information about tobacco shops in Amsterdam Oost, including addresses, opening hours, directions, and nearby public transport where available."
};

export default function OostPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Oost"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Oost, including addresses, opening hours, directions, and nearby public transport where available."
      shops={getShopsByNeighborhood("Oost")}
      searchHref="/search?neighborhood=Oost"
    />
  );
}
