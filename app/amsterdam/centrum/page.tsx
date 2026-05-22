import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Centrum | TobaccoNearby"
  },
  description:
    "Find practical information about tobacco shops in Amsterdam Centrum, including addresses, opening hours, directions, and contact details. Adults 18+ only.",
  alternates: {
    canonical: "/amsterdam/centrum"
  }
};

export default async function CentrumPage() {
  const shops = await getShopsByNeighborhood("Centrum");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Centrum"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Centrum. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Centrum covers central Amsterdam, including areas close to Damrak, Dam Square and major public transport connections. Use the listings to compare practical details such as address, opening hours and directions before visiting."
      shops={shops}
      searchHref="/search?neighborhood=Centrum"
      mapNote="Centrum listings may be close to major transit points, but opening hours can vary during holidays and events."
    />
  );
}
