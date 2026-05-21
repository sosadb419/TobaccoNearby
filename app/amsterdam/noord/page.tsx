import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/data/shops";

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Noord",
  description:
    "Find practical information about tobacco shops in Amsterdam Noord, including addresses, opening hours, directions, ferry notes, and contact details."
};

export default function NoordPage() {
  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Noord"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Noord, including addresses, opening hours, directions, ferry notes, and available contact details."
      shops={getShopsByNeighborhood("Noord")}
      searchHref="/search?neighborhood=Noord"
    />
  );
}
