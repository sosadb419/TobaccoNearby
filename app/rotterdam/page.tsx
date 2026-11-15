import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { getCityDefinition } from "@/data/cities";
import { rotterdamCityPage } from "@/data/rotterdam";
import { filterShopsForCity, getAllShops, getIndexableRotterdamAreas } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: rotterdamCityPage.title },
  description: rotterdamCityPage.description,
  alternates: {
    canonical: "/rotterdam"
  },
  robots: {
    index: true,
    follow: true
  }
};

const rotterdamCity = getCityDefinition("rotterdam");

export default async function RotterdamPage() {
  if (!rotterdamCity) {
    return null;
  }

  const allShops = await getAllShops();
  const shops = filterShopsForCity(allShops, "rotterdam");
  const eligibleAreas = getIndexableRotterdamAreas(allShops);

  return (
    <CityLandingPage
      areaContext={rotterdamCityPage.areaContext}
      areaLinks={eligibleAreas.map(({ area, shops: areaShops }) => ({
        count: areaShops.length,
        href: area.href,
        label: area.label
      }))}
      city={rotterdamCity}
      contextHeading={rotterdamCityPage.contextHeading}
      eyebrow={rotterdamCityPage.eyebrow}
      faqItems={rotterdamCityPage.faqs}
      intro={rotterdamCityPage.intro}
      listingHeading={rotterdamCityPage.listingHeading}
      listingIntro={rotterdamCityPage.listingIntro}
      practicalInfo={rotterdamCityPage.practicalInfo}
      shops={shops}
      title={rotterdamCityPage.h1}
    />
  );
}
