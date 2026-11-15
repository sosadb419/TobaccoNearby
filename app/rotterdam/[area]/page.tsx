import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityLandingPage from "@/components/CityLandingPage";
import { getCityDefinition } from "@/data/cities";
import { getRotterdamAreaDefinition } from "@/data/rotterdam";
import {
  filterShopsForRotterdamArea,
  getAllShops,
  getIndexableRotterdamAreas
} from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type RotterdamAreaPageProps = {
  params: Promise<{ area: string }>;
};

const rotterdamCity = getCityDefinition("rotterdam");

export async function generateStaticParams() {
  const shops = await getAllShops();

  return getIndexableRotterdamAreas(shops).map(({ area }) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: RotterdamAreaPageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = getRotterdamAreaDefinition(areaSlug);

  if (!area) {
    return { title: "Rotterdam area not found", robots: { index: false, follow: true } };
  }

  const shops = await getAllShops();
  const areaShops = filterShopsForRotterdamArea(shops, area);
  const isIndexable = areaShops.length >= area.minimumListings;

  return {
    title: { absolute: area.title },
    description: area.description,
    alternates: { canonical: area.href },
    robots: { index: isIndexable, follow: true }
  };
}

export default async function RotterdamAreaPage({ params }: RotterdamAreaPageProps) {
  const { area: areaSlug } = await params;
  const area = getRotterdamAreaDefinition(areaSlug);

  if (!area || !rotterdamCity) {
    notFound();
  }

  const allShops = await getAllShops();
  const shops = filterShopsForRotterdamArea(allShops, area);

  if (shops.length < area.minimumListings) {
    notFound();
  }

  const eligibleAreas = getIndexableRotterdamAreas(allShops);
  const relatedAreaSlugs = new Set([area.slug, ...area.relatedAreaSlugs]);
  const searchParams = new URLSearchParams({
    city: "rotterdam",
    neighborhood: area.slug,
    q: area.label
  });

  return (
    <CityLandingPage
      allListingsHref={`/search?${searchParams.toString()}`}
      areaContext={area.areaContext}
      areaLinks={eligibleAreas
        .filter(({ area: linkedArea }) => relatedAreaSlugs.has(linkedArea.slug))
        .map(({ area: linkedArea, shops: areaShops }) => ({
          count: areaShops.length,
          href: linkedArea.href,
          label: linkedArea.label
        }))}
      breadcrumbLabel={area.breadcrumbLabel}
      city={rotterdamCity}
      contextHeading={area.contextHeading}
      eyebrow={area.eyebrow}
      faqItems={area.faqs}
      intro={area.intro}
      listingHeading={area.listingHeading}
      listingIntro={area.listingIntro}
      pageHref={area.href}
      practicalInfo={area.practicalInfo}
      shops={shops}
      title={area.h1}
    />
  );
}
