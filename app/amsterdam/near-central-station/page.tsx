import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsNearCentralStation } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops near Amsterdam Central Station | TobaccoNearby"
  },
  description:
    "Search tobacco shops near Amsterdam Central Station with address details, opening hours, directions, and practical travel information.",
  alternates: {
    canonical: "/amsterdam/near-central-station"
  }
};

export default async function NearCentralStationPage() {
  const shops = await getShopsNearCentralStation(2);

  return (
    <NeighborhoodPage
      title="Tobacco Shops Near Amsterdam Central Station"
      intro="This page provides neutral, practical information about listed tobacco shops near Amsterdam Central Station. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Central Station is a major transport hub for trains, metro, trams, buses and ferries. Distances on this page use the station area as a practical reference point."
      shops={shops}
      searchHref="/search?q=Amsterdam%20Centraal"
      mapNote="Distances are approximate and use Amsterdam Central Station as the reference point."
    />
  );
}
