import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam West",
  description:
    "Find practical information about tobacco shops in Amsterdam West, including addresses, opening hours, directions, and accessibility notes where available."
};

export default function WestPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam West"
      intro="Use this page to find practical information about tobacco shops in Amsterdam West, including addresses, opening hours, directions, and accessibility notes where available."
      shops={getShopsByNeighborhood("West")}
      searchHref="/search?neighborhood=West"
    />
  );
}
