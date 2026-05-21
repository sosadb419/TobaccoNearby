import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Centrum",
  description:
    "Find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and contact details."
};

export default function CentrumPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Centrum"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and available contact details."
      shops={getShopsByNeighborhood("Centrum")}
      searchHref="/search?neighborhood=Centrum"
      mapNote="Centrum listings may be close to major transit points, but opening hours can vary during holidays and events."
    />
  );
}
