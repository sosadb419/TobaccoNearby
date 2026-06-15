import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage, getSeoPageMetadata, seoLandingPages } from "@/data/seo-pages";
import { filterShopsForSeoArea } from "@/lib/seo-areas";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GermanRootSeoPageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

export function generateStaticParams() {
  return seoLandingPages
    .filter((page) => {
      const parts = page.href.split("/").filter(Boolean);

      return parts.length === 2 && parts[0] === "de";
    })
    .map((page) => ({
      seoSlug: page.href.replace("/de/", "")
    }));
}

export async function generateMetadata({ params }: GermanRootSeoPageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/de/${seoSlug}`);

  if (!page) {
    return {};
  }

  return getSeoPageMetadata(page);
}

export default async function GermanRootSeoPage({ params }: GermanRootSeoPageProps) {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/de/${seoSlug}`);

  if (!page) {
    notFound();
  }

  const shops = filterShopsForSeoArea(await getAllShops(), page.areaSlug);

  return <SeoLandingPage page={page} shops={shops} />;
}
