import type { MetadataRoute } from "next";
import { areaDefinitions } from "@/data/areas";
import { seoLandingPages } from "@/data/seo-pages";
import { getAllShops, getIndexableUtrechtAreas } from "@/lib/shop-data";
import { SITE_URL } from "@/lib/site-config";

const staticRoutes = [
  "",
  "/utrecht",
  "/tabakswinkel-utrecht",
  "/sigaretten-kopen-utrecht",
  "/forum",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/disclaimer",
  "/add-or-update-a-shop",
  ...areaDefinitions.map((area) => area.href),
  ...seoLandingPages.map((page) => page.href)
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getAllShops();
  const now = new Date();
  const utrechtAreaRoutes = getIndexableUtrechtAreas(shops).map(({ area }) => area.href);
  const publicRoutes = [...new Set([...staticRoutes, ...utrechtAreaRoutes])];
  const staticEntries = publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/amsterdam") || route.startsWith("/utrecht") ? 0.8 : 0.6
  })) satisfies MetadataRoute.Sitemap;

  const shopEntries = shops.map((shop) => ({
    url: `${SITE_URL}/shops/${shop.slug}`,
    lastModified: new Date(shop.lastUpdated),
    changeFrequency: "weekly",
    priority: 0.7
  })) satisfies MetadataRoute.Sitemap;

  return [...staticEntries, ...shopEntries];
}
