import type { MetadataRoute } from "next";
import { areaDefinitions } from "@/data/areas";
import { seoLandingPages } from "@/data/seo-pages";
import { getAllShops } from "@/lib/shop-data";

const siteUrl = "https://tobacconearby.com";

const staticRoutes = [
  "",
  "/search",
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
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/search" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/amsterdam") ? 0.8 : 0.6
  })) satisfies MetadataRoute.Sitemap;

  const shopEntries = shops.map((shop) => ({
    url: `${siteUrl}/shops/${shop.slug}`,
    lastModified: new Date(shop.lastUpdated),
    changeFrequency: "weekly",
    priority: 0.7
  })) satisfies MetadataRoute.Sitemap;

  return [...staticEntries, ...shopEntries];
}
