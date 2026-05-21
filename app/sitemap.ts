import type { MetadataRoute } from "next";
import { getAllShops } from "@/lib/shop-data";

const siteUrl = "https://tobacconearby.com";

const staticRoutes = [
  "",
  "/search",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/disclaimer",
  "/add-or-update-a-shop",
  "/amsterdam/centrum",
  "/amsterdam/de-pijp",
  "/amsterdam/west",
  "/amsterdam/oost",
  "/amsterdam/noord",
  "/amsterdam/zuid",
  "/amsterdam/near-central-station"
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
