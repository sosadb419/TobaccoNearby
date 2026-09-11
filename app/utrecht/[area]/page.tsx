import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UtrechtLandingPage from "@/components/UtrechtLandingPage";
import { getUtrechtAreaDefinition } from "@/data/utrecht-seo";
import {
  filterShopsForCityArea,
  getAllShops,
  getIndexableUtrechtAreas
} from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type UtrechtAreaPageProps = {
  params: Promise<{ area: string }>;
};

export async function generateStaticParams() {
  const shops = await getAllShops();

  return getIndexableUtrechtAreas(shops).map(({ area }) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: UtrechtAreaPageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = getUtrechtAreaDefinition(areaSlug);

  if (!area) {
    return { title: "Utrecht area not found", robots: { index: false, follow: true } };
  }

  const shops = await getAllShops();
  const areaShops = filterShopsForCityArea(shops, "utrecht", area);
  const isIndexable = areaShops.length >= area.minimumListings;

  return {
    title: { absolute: area.title },
    description: area.description,
    alternates: { canonical: area.href },
    robots: { index: isIndexable, follow: true }
  };
}

export default async function UtrechtAreaPage({ params }: UtrechtAreaPageProps) {
  const { area: areaSlug } = await params;
  const area = getUtrechtAreaDefinition(areaSlug);

  if (!area) {
    notFound();
  }

  const allShops = await getAllShops();
  const shops = filterShopsForCityArea(allShops, "utrecht", area);

  if (shops.length < area.minimumListings) {
    notFound();
  }

  const eligibleAreas = getIndexableUtrechtAreas(allShops);

  return (
    <UtrechtLandingPage
      config={area}
      currentAreaSlug={area.slug}
      shops={shops}
      eligibleAreas={eligibleAreas}
    />
  );
}
