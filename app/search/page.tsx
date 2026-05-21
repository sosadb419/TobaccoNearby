import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import {
  amsterdamCentralStation,
  Coordinates,
  getDistanceKm,
  isOpenNow,
  neighborhoods,
  normalize,
  searchShops,
  shops
} from "@/data/shops";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tobacco Shops Near You in Amsterdam",
  description:
    "Search nearby tobacco shops in Amsterdam by neighborhood, postal code, distance, opening hours, and accessibility information where available."
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    lat?: string;
    lng?: string;
    sort?: string;
    openNow?: string;
    neighborhood?: string;
    accessible?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const userLocation = getUserLocation(params.lat, params.lng);
  const selectedNeighborhood = params.neighborhood ?? "";
  const baseOrigin = userLocation ?? amsterdamCentralStation;

  let results = query ? searchShops(query) : shops;

  if (selectedNeighborhood) {
    results = results.filter((shop) => normalize(shop.neighborhood) === normalize(selectedNeighborhood));
  }

  if (params.accessible === "true") {
    results = results.filter((shop) => shop.wheelchairAccessible === true);
  }

  if (params.openNow === "true") {
    results = results.filter((shop) => isOpenNow(shop));
  }

  if (params.sort === "nearest" || userLocation) {
    results = [...results].sort((a, b) => getDistanceKm(a, baseOrigin) - getDistanceKm(b, baseOrigin));
  }

  const filterParams = new URLSearchParams();
  if (query) filterParams.set("q", query);
  if (params.lat && params.lng) {
    filterParams.set("lat", params.lat);
    filterParams.set("lng", params.lng);
  }
  if (params.sort) filterParams.set("sort", params.sort);
  if (params.openNow) filterParams.set("openNow", params.openNow);
  if (params.accessible) filterParams.set("accessible", params.accessible);
  if (selectedNeighborhood) filterParams.set("neighborhood", selectedNeighborhood);

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase text-teal">Amsterdam search</p>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Tobacco shops near you in Amsterdam</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Use filters for practical information only. Listings are neutral and should be verified before visiting.
        </p>
      </div>

      <AdSlot placement="header" />

      <div className="mt-6 rounded-lg border border-line bg-white p-4 shadow-sm">
        <SearchBar initialQuery={query} compact />
        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <SlidersHorizontal aria-hidden="true" size={17} />
            Filters
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterLink label="Open now" params={filterParams} name="openNow" value="true" active={params.openNow === "true"} />
            <FilterLink label="Nearest" params={filterParams} name="sort" value="nearest" active={params.sort === "nearest" || Boolean(userLocation)} />
            <FilterLink
              label="Wheelchair accessible"
              params={filterParams}
              name="accessible"
              value="true"
              active={params.accessible === "true"}
            />
            <Link
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted hover:border-teal hover:text-teal"
              href="/search"
            >
              Clear filters
            </Link>
          </div>
          <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" action="/search">
            {query ? <input type="hidden" name="q" value={query} /> : null}
            {params.lat ? <input type="hidden" name="lat" value={params.lat} /> : null}
            {params.lng ? <input type="hidden" name="lng" value={params.lng} /> : null}
            {params.sort ? <input type="hidden" name="sort" value={params.sort} /> : null}
            {params.openNow ? <input type="hidden" name="openNow" value={params.openNow} /> : null}
            {params.accessible ? <input type="hidden" name="accessible" value={params.accessible} /> : null}
            <label className="sr-only" htmlFor="neighborhood">
              Neighborhood
            </label>
            <select
              className="focus-ring min-h-11 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
              id="neighborhood"
              name="neighborhood"
              defaultValue={selectedNeighborhood}
            >
              <option value="">All neighborhoods</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.slug} value={neighborhood.name}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
            <button className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal" type="submit">
              Apply
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="grid gap-5">
          <p className="text-sm text-muted">
            Showing <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "listing" : "listings"}
            {query ? ` for "${query}"` : ""}.
          </p>

          {results.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">No matching demo listings</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Try another Amsterdam neighborhood or remove filters. Production data should be verified before launch.
              </p>
            </div>
          ) : null}

          {results.map((shop, index) => (
            <div key={shop.slug} className="grid gap-5">
              <ShopCard shop={shop} origin={baseOrigin} showLiveStatus />
              {index === 2 ? <AdSlot placement="in-content" /> : null}
            </div>
          ))}
        </div>

        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Amsterdam neighborhoods</h2>
            <div className="mt-4 grid gap-2 text-sm">
              {neighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.slug}
                  className="focus-ring rounded-md py-1 text-muted hover:text-teal"
                  href={neighborhood.slug === "jordaan" || neighborhood.slug === "zuidoost" ? `/search?neighborhood=${encodeURIComponent(neighborhood.name)}` : `/amsterdam/${neighborhood.slug}`}
                >
                  {neighborhood.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Please verify opening hours, accessibility details, and product availability before visiting.
          </div>
        </aside>
      </div>
    </section>
  );
}

function FilterLink({
  label,
  params,
  name,
  value,
  active
}: {
  label: string;
  params: URLSearchParams;
  name: string;
  value: string;
  active: boolean;
}) {
  const nextParams = new URLSearchParams(params);

  if (active) {
    nextParams.delete(name);
  } else {
    nextParams.set(name, value);
  }

  return (
    <Link
      className={`focus-ring rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active ? "border-teal bg-teal text-white" : "border-line bg-white text-muted hover:border-teal hover:text-teal"
      }`}
      href={`/search${nextParams.toString() ? `?${nextParams.toString()}` : ""}`}
    >
      {label}
    </Link>
  );
}

function getUserLocation(lat?: string, lng?: string): Coordinates | undefined {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  return { latitude, longitude };
}
