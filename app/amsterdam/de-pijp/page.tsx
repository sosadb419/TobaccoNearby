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
      title="Tobacco Shops in De Pijp Amsterdam"
      areaName="De Pijp Amsterdam"
      intro="This page provides neutral, practical information about listed tobacco shops in De Pijp, Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="De Pijp is a dense residential and commercial area in Amsterdam Zuid, with local services around Ferdinand Bolstraat, Ceintuurbaan and nearby metro and tram stops."
      practicalInfo={[
        "De Pijp listings may be useful for checking shop locations near residential streets, markets, tram stops and metro station De Pijp.",
        "Opening hours can vary between small local shops and service counters, especially on Sundays or holidays.",
        "Use the listing details to compare address, phone, website, accessibility information and map directions where available."
      ]}
      shops={shops}
      searchHref="/search?neighborhood=De%20Pijp"
    />
  );
}
