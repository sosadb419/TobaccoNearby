import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsByNeighborhood } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Amsterdam Noord | TobaccoNearby"
  },
  description:
    "View tobacco shop listings in Amsterdam Noord with address details, opening hours, map directions, and contact information where available.",
  alternates: {
    canonical: "/amsterdam/noord"
  }
};

export default async function NoordPage() {
  const shops = await getShopsByNeighborhood("Noord");

  return (
    <NeighborhoodPage
      title="Tobacco Shops in Amsterdam Noord"
      intro="This page provides neutral, practical information about listed tobacco shops in Amsterdam Noord. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Noord includes neighborhoods north of the IJ, with ferry, bus and metro connections depending on the area. Use the listings for practical address, opening hour and direction checks."
      shops={shops}
      searchHref="/search?neighborhood=Noord"
    />
  );
}
