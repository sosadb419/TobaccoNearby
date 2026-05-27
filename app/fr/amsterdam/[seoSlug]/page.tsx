import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage, getSeoLandingPagesByPrefix, getSeoPageMetadata } from "@/data/seo-pages";
import { filterShopsForSeoArea } from "@/lib/seo-areas";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SeoSlugPageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

export function generateStaticParams() {
  return getSeoLandingPagesByPrefix("/fr/amsterdam/").map((page) => ({
    seoSlug: page.href.replace("/fr/amsterdam/", "")
  }));
}

export async function generateMetadata({ params }: SeoSlugPageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/fr/amsterdam/${seoSlug}`);

  if (!page) {
    return {};
  }

  return getSeoPageMetadata(page);
}

export default async function FrenchAmsterdamSeoSlugPage({ params }: SeoSlugPageProps) {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/fr/amsterdam/${seoSlug}`);

  if (!page) {
    notFound();
  }

  const shops = filterShopsForSeoArea(await getAllShops(), page.areaSlug);

  return <SeoLandingPage page={page} shops={shops} />;
}
