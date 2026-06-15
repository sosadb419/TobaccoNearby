import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage, getSeoPageMetadata, seoLandingPages } from "@/data/seo-pages";
import { filterShopsForSeoArea } from "@/lib/seo-areas";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RootSeoPageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

export function generateStaticParams() {
  return seoLandingPages
    .filter((page) => page.href.split("/").filter(Boolean).length === 1)
    .map((page) => ({
      seoSlug: page.href.replace("/", "")
    }));
}

export async function generateMetadata({ params }: RootSeoPageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/${seoSlug}`);

  if (!page) {
    return {};
  }

  return getSeoPageMetadata(page);
}

export default async function RootSeoPage({ params }: RootSeoPageProps) {
  const { seoSlug } = await params;
  const page = getSeoLandingPage(`/${seoSlug}`);

  if (!page) {
    notFound();
  }

  const shops = filterShopsForSeoArea(await getAllShops(), page.areaSlug);

  return <SeoLandingPage page={page} shops={shops} />;
}
