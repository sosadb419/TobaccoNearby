import type { Metadata } from "next";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getSeoLandingPage } from "@/data/seo-pages";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = getSeoLandingPage("/amsterdam/sigaretten-kopen")!;

export const metadata: Metadata = {
  title: {
    absolute: page.metadataTitle
  },
  description: page.metadataDescription,
  alternates: {
    canonical: page.href
  }
};

export default async function SigarettenKopenPage() {
  const shops = await getAllShops();

  return <SeoLandingPage page={page} shops={shops} />;
}
