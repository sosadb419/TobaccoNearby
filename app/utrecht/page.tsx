import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityLandingPage from "@/components/CityLandingPage";
import { getCityDefinition } from "@/data/cities";
import { getShopsForCity } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Tobacco Shops in Utrecht | Map, Opening Hours & Directions"
  },
  description:
    "Find practical location information for tobacco shops, kiosks and gas stations in Utrecht, including map view, opening hours, directions and contact details. Adults 18+ only.",
  alternates: {
    canonical: "/utrecht"
  },
  robots: {
    index: true,
    follow: true
  }
};

const practicalInfo = [
  "Search by Utrecht area, street, postal code or neighborhood, including published records such as Centrum, Overvecht, Zuilen, Lombok, De Meern or other areas where data is available.",
  "Use the directions links for address-based Google Maps routes. Map locations are approximate and should be verified before visiting.",
  "If browser location access is allowed, distance sorting uses your current location only in the browser session. Without it, Utrecht listings use Utrecht Centraal as the local reference point.",
  "Opening hours, contact details and accessibility information can change, so check important details before travelling."
];

export default async function UtrechtPage() {
  const city = getCityDefinition("utrecht");

  if (!city) {
    notFound();
  }

  const shops = await getShopsForCity(city.slug);

  return (
    <CityLandingPage
      city={city}
      intro="This page provides neutral, practical information about listed tobacco shops, kiosks and gas stations in Utrecht. Listings may include addresses, opening hours, contact details, accessibility information and map directions where available. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking."
      practicalInfo={practicalInfo}
      shops={shops}
      title="Tobacco Shops in Utrecht"
    />
  );
}
