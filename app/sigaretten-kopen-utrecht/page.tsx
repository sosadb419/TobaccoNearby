import type { Metadata } from "next";
import UtrechtLandingPage from "@/components/UtrechtLandingPage";
import { utrechtDutchPages } from "@/data/utrecht-seo";
import { filterShopsForCity, getAllShops, getIndexableUtrechtAreas } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = utrechtDutchPages.sigaretten;

export const metadata: Metadata = {
  title: { absolute: config.title },
  description: config.description,
  alternates: { canonical: config.href },
  robots: { index: true, follow: true }
};

export default async function SigarettenKopenUtrechtPage() {
  const allShops = await getAllShops();
  const shops = filterShopsForCity(allShops, "utrecht");
  const eligibleAreas = getIndexableUtrechtAreas(allShops);

  return <UtrechtLandingPage config={config} shops={shops} eligibleAreas={eligibleAreas} />;
}
