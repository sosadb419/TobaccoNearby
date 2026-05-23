import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import ShopMap from "@/components/ShopMap";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import {
  amsterdamCentralStation,
  Coordinates,
  Shop,
  getDistanceKm,
  isOpenNow,
  neighborhoods,
  normalize
} from "@/data/shops";
import { getAllShops, searchShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const quickSearches = [
  "Centrum",
  "De Pijp",
  "West",
  "Oost",
  "Noord",
  "Zuid",
  "Zuidoost",
  "Amsterdam Centraal"
];

const neighborhoodFilterOptions = [
  "Centrum",
  "De Pijp",
  "Jordaan",
  "De Wallen",
  "West",
  "Oost",
  "Noord",
  "Zuid",
  "Zuidoost"
];

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
    hasPhone?: string;
    hasWebsite?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const userLocation = getUserLocation(params.lat, params.lng);
  const selectedNeighborhood = params.neighborhood ?? "";
  const wantsNearest = params.sort === "nearest";
  const nearestNeedsLocation = wantsNearest && !userLocation;
  const baseOrigin = userLocation ?? amsterdamCentralStation;

  const baseResults = query ? await searchShops(query) : await getAllShops();
  const filters: ShopFilters = {
    openNow: params.openNow === "true",
    sortNearest: wantsNearest,
    selectedNeighborhood,
    hasPhone: params.hasPhone === "true",
    hasWebsite: params.hasWebsite === "true",
    wheelchairAccessible: params.accessible === "true",
    userLocation
  };
  const results = applyShopFilters(baseResults, filters);
  const activeFilterLabels = getActiveFilterLabels(filters);
  const hasActiveFilters = activeFilterLabels.length > 0;

  const filterParams = new URLSearchParams();
  if (query) filterParams.set("q", query);
  if (params.lat && params.lng) {
    filterParams.set("lat", params.lat);
    filterParams.set("lng", params.lng);
  }
  if (params.sort) filterParams.set("sort", params.sort);
  if (params.openNow) filterParams.set("openNow", params.openNow);
  if (params.accessible) filterParams.set("accessible", params.accessible);
  if (params.hasPhone) filterParams.set("hasPhone", params.hasPhone);
  if (params.hasWebsite) filterParams.set("hasWebsite", params.hasWebsite);
  if (selectedNeighborhood) filterParams.set("neighborhood", selectedNeighborhood);

  const clearFilterParams = new URLSearchParams();
  if (query) clearFilterParams.set("q", query);
  const clearFiltersHref = `/search${clearFilterParams.toString() ? `?${clearFilterParams.toString()}` : ""}`;
  const emptyStateMessage = hasActiveFilters
    ? "No shops found with these filters. Try adjusting your search or filters."
    : "No shops found for this search. Try another neighborhood, postal code, or nearby area.";

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
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink">Quick searches</span>
          {quickSearches.map((item) => {
            const isActive = normalize(query) === normalize(item);

            return (
              <TrackedNeighborhoodLink
                key={item}
                className={`focus-ring rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-white text-muted hover:border-teal hover:text-teal"
                }`}
                href={`/search?q=${encodeURIComponent(item)}`}
                neighborhood={item}
              >
                {item}
              </TrackedNeighborhoodLink>
            );
          })}
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <SlidersHorizontal aria-hidden="true" size={17} />
            Filters
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterLink label="Open now" params={filterParams} name="openNow" value="true" active={params.openNow === "true"} />
            <FilterLink label="Nearest" params={filterParams} name="sort" value="nearest" active={wantsNearest} />
            <FilterLink label="Has phone number" params={filterParams} name="hasPhone" value="true" active={params.hasPhone === "true"} />
            <FilterLink label="Has website" params={filterParams} name="hasWebsite" value="true" active={params.hasWebsite === "true"} />
            <FilterLink
              label="Wheelchair accessible"
              params={filterParams}
              name="accessible"
              value="true"
              active={params.accessible === "true"}
            />
            <Link
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted hover:border-teal hover:text-teal"
              href={clearFiltersHref}
            >
              Clear filters
            </Link>
          </div>
          {nearestNeedsLocation ? (
            <p className="mt-3 text-sm leading-6 text-muted">Allow location access to sort by nearest.</p>
          ) : null}
          <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" action="/search">
            {query ? <input type="hidden" name="q" value={query} /> : null}
            {params.lat ? <input type="hidden" name="lat" value={params.lat} /> : null}
            {params.lng ? <input type="hidden" name="lng" value={params.lng} /> : null}
            {params.sort ? <input type="hidden" name="sort" value={params.sort} /> : null}
            {params.openNow ? <input type="hidden" name="openNow" value={params.openNow} /> : null}
            {params.accessible ? <input type="hidden" name="accessible" value={params.accessible} /> : null}
            {params.hasPhone ? <input type="hidden" name="hasPhone" value={params.hasPhone} /> : null}
            {params.hasWebsite ? <input type="hidden" name="hasWebsite" value={params.hasWebsite} /> : null}
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
              {neighborhoodFilterOptions.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </select>
            <button className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal" type="submit">
              Apply
            </button>
          </form>
          {activeFilterLabels.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-ink">Active filters</span>
              {activeFilterLabels.map((label) => (
                <span key={label} className="rounded-lg bg-paper px-3 py-2 text-sm font-semibold text-muted">
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <ShopMap shops={results} userLocation={userLocation} collapsibleOnMobile />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="grid gap-5">
          <DisclaimerNotice />

          {query ? (
            <div className="rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted">
              Active search: <strong className="text-ink">{query}</strong>
            </div>
          ) : null}

          <p className="text-sm text-muted">
            Showing <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "listing" : "listings"}
            {query ? ` for "${query}"` : ""}.
          </p>

          {results.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">No matching listings</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{emptyStateMessage}</p>
            </div>
          ) : null}

          {results.map((shop, index) => (
            <div key={shop.slug} className="grid gap-5">
              <ShopCard shop={shop} origin={baseOrigin} showLiveStatus />
              {index === 2 ? <AdSlot placement="in-content" /> : null}
            </div>
          ))}
        </div>

        <aside className="hidden gap-5 lg:grid">
          <div className="sticky top-6">
            <ShopMap shops={results} userLocation={userLocation} />
          </div>
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Amsterdam neighborhoods</h2>
            <div className="mt-4 grid gap-2 text-sm">
              {neighborhoods.map((neighborhood) => (
                <TrackedNeighborhoodLink
                  key={neighborhood.slug}
                  className="focus-ring rounded-md py-1 text-muted hover:text-teal"
                  href={`/amsterdam/${neighborhood.slug}`}
                  neighborhood={neighborhood.name}
                >
                  {neighborhood.name}
                </TrackedNeighborhoodLink>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

type ShopFilters = {
  openNow: boolean;
  sortNearest: boolean;
  selectedNeighborhood: string;
  hasPhone: boolean;
  hasWebsite: boolean;
  wheelchairAccessible: boolean;
  userLocation?: Coordinates;
};

function applyShopFilters(shops: Shop[], filters: ShopFilters) {
  let filteredShops = [...shops];

  if (filters.selectedNeighborhood) {
    const neighborhoodTarget = getNeighborhoodFilterTarget(filters.selectedNeighborhood);

    filteredShops = filteredShops.filter((shop) => normalize(shop.neighborhood) === normalize(neighborhoodTarget));
  }

  if (filters.openNow) {
    filteredShops = filteredShops.filter(isShopOpenNow);
  }

  if (filters.hasPhone) {
    filteredShops = filteredShops.filter((shop) => hasText(shop.phone));
  }

  if (filters.hasWebsite) {
    filteredShops = filteredShops.filter((shop) => hasText(shop.website));
  }

  if (filters.wheelchairAccessible) {
    filteredShops = filteredShops.filter((shop) => shop.wheelchairAccessible === true);
  }

  if (filters.sortNearest && filters.userLocation) {
    const userLocation = filters.userLocation;

    filteredShops = filteredShops.sort(
      (a, b) =>
        calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) -
        calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
    );
  }

  return filteredShops;
}

function isShopOpenNow(shop: Shop) {
  return shop.openingHours.length > 0 && isOpenNow(shop);
}

function calculateDistanceKm(userLat: number, userLng: number, shopLat: number, shopLng: number) {
  return getDistanceKm({ latitude: shopLat, longitude: shopLng }, { latitude: userLat, longitude: userLng });
}

function hasText(value?: string) {
  return Boolean(value && value.trim());
}

function getNeighborhoodFilterTarget(neighborhood: string) {
  return normalize(neighborhood) === "de-wallen" ? "Centrum" : neighborhood;
}

function getActiveFilterLabels(filters: ShopFilters) {
  const labels: string[] = [];

  if (filters.openNow) labels.push("Open now");
  if (filters.sortNearest) labels.push("Nearest");
  if (filters.selectedNeighborhood) labels.push(filters.selectedNeighborhood);
  if (filters.hasPhone) labels.push("Has phone number");
  if (filters.hasWebsite) labels.push("Has website");
  if (filters.wheelchairAccessible) labels.push("Wheelchair accessible");

  return labels;
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
