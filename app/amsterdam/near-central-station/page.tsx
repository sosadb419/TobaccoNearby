import type { Metadata } from "next";
import NeighborhoodPage from "@/components/NeighborhoodPage";
import { getShopsForCentralStationArea } from "@/lib/shop-data";

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
  const shops = await getShopsForCentralStationArea();

  return (
    <NeighborhoodPage
      title="Tobacco Shops near Amsterdam Central Station"
      areaName="Amsterdam Central Station"
      intro="This page provides neutral, practical information about listed tobacco shops near Amsterdam Central Station. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      areaContext="Amsterdam Central Station is a major transport hub for trains, metro, trams, buses and ferries. This page includes Centrum listings and records with Central Station-related address or public transport context where available."
      practicalInfo={[
        "Amsterdam Central Station can be busy throughout the day, so users should verify shop opening hours before visiting.",
        "Listings may include nearby Centrum shops or records with station-related address, direction or public transport information.",
        "Use directions links for route planning and confirm contact details directly with the shop when possible."
      ]}
      shops={shops}
      searchHref="/search?q=Amsterdam%20Centraal"
      mapNote="Distances are approximate and use Amsterdam Central Station as the reference point."
    />
  );
}
