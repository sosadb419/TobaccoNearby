import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage } from "@/data/seo-pages";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = getSeoLandingPage("/amsterdam/tobacco-shops")!;

export const metadata: Metadata = {
  title: {
    absolute: page.metadataTitle
  },
  description: page.metadataDescription,
  alternates: {
    canonical: page.href
  }
};

export default async function TobaccoShopsPage() {
  const shops = await getAllShops();

  return <SeoLandingPage page={page} shops={shops} />;
}
