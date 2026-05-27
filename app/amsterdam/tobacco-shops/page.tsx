import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage, getSeoPageMetadata } from "@/data/seo-pages";
import { filterShopsForSeoArea } from "@/lib/seo-areas";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = getSeoLandingPage("/amsterdam/tobacco-shops")!;

export const metadata: Metadata = {
  ...getSeoPageMetadata(page)
};

export default async function TobaccoShopsPage() {
  const shops = filterShopsForSeoArea(await getAllShops(), page.areaSlug);

  return <SeoLandingPage page={page} shops={shops} />;
}
