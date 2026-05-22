import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Jordaan Amsterdam | TobaccoNearby"
  },
  description:
    "View listed tobacco shops in the Jordaan area of Amsterdam with addresses, opening hours, directions, and available contact details.",
  alternates: {
    canonical: "/amsterdam/jordaan"
  }
};

export default async function JordaanPage() {
  const shops = await getShopsByNeighborhood("Jordaan");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Jordaan Amsterdam"
      intro="This page provides neutral, practical information about listed tobacco shops in the Jordaan area of Amsterdam. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="The Jordaan area includes local streets such as Westerstraat and nearby routes around Rozengracht and Noordermarkt. Use listed shop information to check addresses, opening hours and directions."
      shops={shops}
      searchHref="/search?neighborhood=Jordaan"
    />
  );
}
