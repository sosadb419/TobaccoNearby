import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Noord",
  description:
    "Find practical information about tobacco shops in Amsterdam Noord, including addresses, opening hours, directions, ferry notes, and contact details."
};

export default async function NoordPage() {
  const shops = await getShopsByNeighborhood("Noord");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Noord"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Noord, including addresses, opening hours, directions, ferry notes, and available contact details."
      shops={shops}
      searchHref="/search?neighborhood=Noord"
    />
  );
}
