import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import FAQSection from "@/components/FAQSection";
import SearchBar from "@/components/SearchBar";
import SearchResultsView from "@/components/SearchResultsView";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { areaDefinitions, getAreaDefinition } from "@/data/areas";
import { primarySeoLandingPages } from "@/data/seo-pages";
import {
  Shop,
  getPlaceTypeLabel,
  isOpenNow,
  normalize,
  placeTypes
} from "@/data/shops";
import { filterShopsForArea, getAllShops, searchShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const quickSearches = areaDefinitions.map((area) => area.searchLabel);

const searchFaqs = [
  {
    question: "How can I search for tobacco shops in Amsterdam?",
    answer:
      "Enter an area, postal code, street, station name or neighborhood. Search results show practical listing details where available."
  },
  {
    question: "Can I search by neighborhood or postal code?",
    answer:
      "Yes. The search page supports neighborhood names such as De Pijp or Noord, area aliases such as Bijlmer, and postal codes such as 1012."
  },
  {
    question: "Can I filter by open now?",
    answer:
      "Yes. The open now filter uses available opening-hours data. If hours are missing or unclear, the listing is not counted as open."
  },
  {
    question: "Can I sort by nearest shop?",
    answer:
      "Yes, if you allow browser location access. You can still search normally without sharing your location."
  },
  {
    question: "Why should I verify opening hours before visiting?",
    answer:
      "Shop data may change because of holidays, temporary closures or local conditions. Verify opening hours and contact details directly before visiting."
  },
  {
    question: "Can I report incorrect shop information?",
    answer:
      "Yes. Use the report or update option to suggest corrections. Submitted updates are reviewed before any changes are made."
  }
];

export const metadata: Metadata = {
  title: {
    absolute: "Search Tobacco Shops in Amsterdam | TobaccoNearby"
  },
  description:
    "Search listed tobacco shops in Amsterdam by neighborhood, postal code, opening hours, accessibility details, and available contact information.",
  alternates: {
    canonical: "/search"
  }
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    locate?: string;
    openNow?: string;
    neighborhood?: string;
    accessible?: string;
    hasPhone?: string;
    hasWebsite?: string;
    placeType?: string;
    perPage?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const selectedNeighborhood = getSelectedAreaSlug(params.neighborhood);
  const selectedPlaceType = getValidPlaceType(params.placeType);
  const wantsNearest = params.sort === "nearest";
  const shouldRequestLocation = params.locate === "true";
  const initialPerPage = params.perPage === "20" ? 20 : 10;

  const baseResults = query ? await searchShops(query) : await getAllShops();
  const filters: ShopFilters = {
    openNow: params.openNow === "true",
    sortNearest: wantsNearest,
    selectedNeighborhood,
    selectedPlaceType,
    hasPhone: params.hasPhone === "true",
    hasWebsite: params.hasWebsite === "true",
    wheelchairAccessible: params.accessible === "true"
  };
  const results = applyShopFilters(baseResults, filters);
  const activeFilterLabels = getActiveFilterLabels(filters);
  const hasActiveFilters = activeFilterLabels.length > 0;

  const filterParams = new URLSearchParams();
  if (query) filterParams.set("q", query);
  if (params.sort) filterParams.set("sort", params.sort);
  if (shouldRequestLocation) filterParams.set("locate", "true");
  if (params.openNow) filterParams.set("openNow", params.openNow);
  if (params.accessible) filterParams.set("accessible", params.accessible);
  if (params.hasPhone) filterParams.set("hasPhone", params.hasPhone);
  if (params.hasWebsite) filterParams.set("hasWebsite", params.hasWebsite);
  if (selectedNeighborhood) filterParams.set("neighborhood", selectedNeighborhood);
  if (selectedPlaceType) filterParams.set("placeType", selectedPlaceType);
  if (initialPerPage === 20) filterParams.set("perPage", "20");

  const clearFilterParams = new URLSearchParams();
  if (query) clearFilterParams.set("q", query);
  const clearFiltersHref = `/search${clearFilterParams.toString() ? `?${clearFilterParams.toString()}` : ""}`;
  const emptyStateMessage = hasActiveFilters
    ? "No shops found with these filters. Try adjusting your search or filters."
    : "No shops found for this search. Try another neighborhood, postal code, or nearby area.";

  return (
    <section className="container-shell py-0 md:py-8">
      <div className="md:mb-6">
        <p className="hidden text-sm font-bold uppercase text-teal md:block">Amsterdam search</p>
        <h1 className="sr-only md:not-sr-only md:mt-3 md:block md:text-3xl md:font-bold md:text-ink lg:text-4xl">
          Tobacco shops near you in Amsterdam
        </h1>
        <p className="mt-3 hidden max-w-3xl text-sm leading-6 text-muted md:block">
          Use filters for practical information only. Listings are neutral and should be verified before visiting.
        </p>
      </div>

      <div className="mt-6 hidden rounded-lg border border-line bg-white p-4 shadow-sm md:block">
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
          <form className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end" action="/search">
            {query ? <input type="hidden" name="q" value={query} /> : null}
            {params.sort ? <input type="hidden" name="sort" value={params.sort} /> : null}
            {shouldRequestLocation ? <input type="hidden" name="locate" value="true" /> : null}
            {params.openNow ? <input type="hidden" name="openNow" value={params.openNow} /> : null}
            {params.accessible ? <input type="hidden" name="accessible" value={params.accessible} /> : null}
            {params.hasPhone ? <input type="hidden" name="hasPhone" value={params.hasPhone} /> : null}
            {params.hasWebsite ? <input type="hidden" name="hasWebsite" value={params.hasWebsite} /> : null}
            <div className="grid gap-1">
              <label className="text-xs font-bold uppercase text-muted" htmlFor="neighborhood">
                Area
              </label>
              <select
                className="focus-ring min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                id="neighborhood"
                name="neighborhood"
                defaultValue={selectedNeighborhood}
              >
                <option value="">All areas</option>
                {areaDefinitions.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-bold uppercase text-muted" htmlFor="placeType">
                Place type
              </label>
              <select
                className="focus-ring min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                id="placeType"
                name="placeType"
                defaultValue={selectedPlaceType}
              >
                <option value="">All types</option>
                {placeTypes.map((placeType) => (
                  <option key={placeType.value} value={placeType.value}>
                    {placeType.label}
                  </option>
                ))}
              </select>
            </div>
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

      <SearchResultsView
        activeFilterLabels={activeFilterLabels}
        emptyStateMessage={emptyStateMessage}
        filterState={filters}
        hasActiveFilters={hasActiveFilters}
        initialPerPage={initialPerPage}
        query={query}
        requestLocation={shouldRequestLocation}
        shops={results}
        sortNearest={wantsNearest}
      />

      <section className="mt-6 rounded-lg border border-line bg-white p-4 md:mt-8 md:p-5" aria-labelledby="search-internal-links-heading">
        <h2 id="search-internal-links-heading" className="text-lg font-bold text-ink">
          Browse Amsterdam pages
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Use these links for crawlable area pages and broader practical location pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {areaDefinitions.map((area) => (
            <TrackedNeighborhoodLink
              key={area.href}
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
              href={area.href}
              neighborhood={area.label}
            >
              {area.label}
            </TrackedNeighborhoodLink>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {primarySeoLandingPages.map((page) => (
            <Link
              key={page.href}
              className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
              href={page.href}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>

      <FAQSection
        className="mt-6 md:mt-8"
        id="search-faq"
        items={searchFaqs}
        intro="Practical answers about search, filters, distance sorting and listing verification."
      />
    </section>
  );
}

type ShopFilters = {
  openNow: boolean;
  sortNearest: boolean;
  selectedNeighborhood: string;
  selectedPlaceType: string;
  hasPhone: boolean;
  hasWebsite: boolean;
  wheelchairAccessible: boolean;
};

function applyShopFilters(shops: Shop[], filters: ShopFilters) {
  let filteredShops = [...shops];

  if (filters.selectedNeighborhood) {
    filteredShops = filterShopsForArea(filteredShops, filters.selectedNeighborhood);
  }

  if (filters.selectedPlaceType) {
    filteredShops = filteredShops.filter((shop) => getNormalizedPlaceType(shop.place_type) === filters.selectedPlaceType);
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

  return filteredShops;
}

function isShopOpenNow(shop: Shop) {
  return shop.openingHours.length > 0 && isOpenNow(shop);
}

function hasText(value?: string) {
  return Boolean(value && value.trim());
}

function getNormalizedPlaceType(placeType?: string) {
  const value = placeType?.trim().toLowerCase() ?? "";

  return placeTypes.some((item) => item.value === value) ? value : "tobacco_shop";
}

function getSelectedAreaSlug(area?: string) {
  if (!area) {
    return "";
  }

  const normalizedArea = normalize(area);
  const areaDefinition = areaDefinitions.find(
    (item) =>
      item.slug === normalizedArea ||
      normalize(item.label) === normalizedArea ||
      normalize(item.searchLabel) === normalizedArea ||
      item.fallbackTerms.some((term) => normalize(term) === normalizedArea)
  );

  return areaDefinition?.slug ?? "";
}

function getValidPlaceType(placeType?: string) {
  const value = placeType?.trim().toLowerCase() ?? "";

  return placeTypes.some((item) => item.value === value) ? value : "";
}

function getActiveFilterLabels(filters: ShopFilters) {
  const labels: string[] = [];

  if (filters.openNow) labels.push("Open now");
  if (filters.sortNearest) labels.push("Nearest");
  if (filters.selectedNeighborhood) labels.push(getAreaDefinition(filters.selectedNeighborhood)?.label ?? filters.selectedNeighborhood);
  if (filters.selectedPlaceType) labels.push(getPlaceTypeLabel(filters.selectedPlaceType));
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
