import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tobacco Shops in Amsterdam Centrum",
  description:
    "Find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and contact details."
};

export default async function CentrumPage() {
  const shops = await getShopsByNeighborhood("Centrum");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Centrum"
      intro="Use this page to find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and available contact details."
      shops={shops}
      searchHref="/search?neighborhood=Centrum"
      mapNote="Centrum listings may be close to major transit points, but opening hours can vary during holidays and events."
    />
  );
}
