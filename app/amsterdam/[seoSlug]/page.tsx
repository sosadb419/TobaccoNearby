import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage, getSeoLandingPagesByPrefix, getSeoPageMetadata } from "@/data/seo-pages";
import { filterShopsForSeoArea } from "@/lib/seo-areas";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const staticAmsterdamSeoSlugs = new Set([
  "buy-cigarettes",
  "sigaretten-kopen",
  "tobacco-shops",
  "waar-sigaretten-kopen",
  "where-to-buy-cigarettes"
]);

type SeoSlugPageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

export function generateStaticParams() {
  return getSeoLandingPagesByPrefix("/amsterdam/")
    .map((page) => page.href.replace("/amsterdam/", ""))
    .filter((seoSlug) => !staticAmsterdamSeoSlugs.has(seoSlug))
    .map((seoSlug) => ({ seoSlug }));
}

export async function generateMetadata({ params }: SeoSlugPageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/amsterdam/${seoSlug}`);

  if (!page) {
    return {};
  }

  return getSeoPageMetadata(page);
}

export default async function AmsterdamSeoSlugPage({ params }: SeoSlugPageProps) {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/amsterdam/${seoSlug}`);

  if (!page) {
    notFound();
  }

  const shops = filterShopsForSeoArea(await getAllShops(), page.areaSlug);

  return <SeoLandingPage page={page} shops={shops} />;
}
