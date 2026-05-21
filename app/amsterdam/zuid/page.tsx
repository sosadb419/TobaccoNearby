import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Zuid",
  description:
    "Find practical information about tobacco shops in Amsterdam Zuid, including addresses, opening hours, directions, and accessibility notes."
};

export default function ZuidPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Zuid"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Zuid, including addresses, opening hours, directions, and accessibility notes where available."
      shops={getShopsByNeighborhood("Zuid")}
      searchHref="/search?neighborhood=Zuid"
    />
  );
}
