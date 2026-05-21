import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Map, Navigation, ShieldCheck } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { neighborhoods } from "@/data/shops";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Find Tobacco Shops Near You in Amsterdam",
  description:
    "Search for practical information about tobacco shops in Amsterdam, including addresses, opening hours, directions, accessibility notes, and contact details."
};

export default async function HomePage() {
  const shops = await getAllShops();
  const featuredShops = shops.slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-shell grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase text-teal">TobaccoNearby</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Find Tobacco Shops Near You in Amsterdam
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Search by area, postal code, or neighborhood to find practical information such as shop locations,
              opening hours, directions, accessibility notes, and contact details.
            </p>
            <p className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
              This website is intended for adults aged 18+.
            </p>
            <div className="mt-7">
              <SearchBar />
            </div>
          </div>

          <div className="map-grid relative min-h-[360px] overflow-hidden rounded-lg border border-line bg-paper p-5 shadow-soft">
            <div className="absolute left-8 top-8 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Map aria-hidden="true" size={18} />
                Amsterdam only
              </div>
              <p className="mt-2 max-w-[14rem] text-sm leading-5 text-muted">
                Built for Amsterdam first, structured to support more Dutch cities later.
              </p>
            </div>
            <div className="absolute bottom-8 right-8 w-[min(78%,22rem)] rounded-lg border border-line bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-teal">Practical details</p>
              <div className="mt-4 grid gap-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Clock aria-hidden="true" size={16} />
                  Opening hours
                </span>
                <span className="flex items-center gap-2">
                  <Navigation aria-hidden="true" size={16} />
                  Directions
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" size={16} />
                  Verification reminder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <AdSlot placement="header" />
      </section>

      <section className="container-shell py-8">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <h2 className="text-2xl font-bold text-ink">Browse Amsterdam neighborhoods</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Use neighborhood pages to narrow results before checking shop details and directions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {neighborhoods.map((neighborhood) => (
              <Link
                key={neighborhood.slug}
                className="focus-ring rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
                href={
                  neighborhood.slug === "jordaan" || neighborhood.slug === "zuidoost"
                    ? `/search?neighborhood=${encodeURIComponent(neighborhood.name)}`
                    : `/amsterdam/${neighborhood.slug}`
                }
              >
                {neighborhood.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Recently updated Amsterdam listings</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Listings are loaded from Supabase when configured, with local fallback records for availability.
            </p>
          </div>
          <Link className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-bold text-teal" href="/search">
            View all listings
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-5">
          {featuredShops.map((shop, index) => (
            <ShopCard key={shop.slug} shop={shop} priorityLabel={index === 0 ? "Closest demo listing" : undefined} />
          ))}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-ink">Neutral information only</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            TobaccoNearby does not sell tobacco products, process orders, show prices, or encourage tobacco use. Shop
            data may change, so users should verify opening hours and product availability before visiting.
          </p>
        </div>
      </section>
    </>
  );
}
