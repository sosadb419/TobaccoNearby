import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in De Pijp Amsterdam | TobaccoNearby"
  },
  description:
    "View listed tobacco shops in De Pijp, Amsterdam with practical information such as address, opening hours, directions, and contact details.",
  alternates: {
    canonical: "/amsterdam/de-pijp"
  }
};

export default async function DePijpPage() {
  const shops = await getShopsByNeighborhood("De Pijp");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in De Pijp"
      intro="This page provides neutral, practical information about listed tobacco shops in De Pijp, Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="De Pijp is a dense residential and commercial area in Amsterdam Zuid, with shops and services around streets such as Ferdinand Bolstraat and nearby metro and tram stops."
      shops={shops}
      searchHref="/search?neighborhood=De%20Pijp"
    />
  );
}
