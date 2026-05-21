import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsNearCentralStation } from "@/lib/shop-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tobacco Shops Near Amsterdam Central Station",
  description:
    "Find practical information about tobacco shops near Amsterdam Central Station, including approximate distance, opening hours, directions, and contact details."
};

export default async function NearCentralStationPage() {
  const shops = await getShopsNearCentralStation(2);

  return (
    <NeighborhoodPage
      title="Tobacco Shops Near Amsterdam Central Station"
      intro="Find location-based information for tobacco shops near Amsterdam Central Station, including approximate walking distance where available, opening hours, and directions."
      shops={shops}
      searchHref="/search?sort=nearest"
      mapNote="Distances are approximate and use Amsterdam Central Station as the reference point."
    />
  );
}
