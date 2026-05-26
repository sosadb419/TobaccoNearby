"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, List, LocateFixed, Map, Search } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import LazyShopMap from "@/components/LazyShopMap";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { Coordinates, Shop, getDistanceKm, neighborhoods, placeTypes } from "@/data/shops";
import { classifySearchType, trackSearchSubmitted, trackUseLocationClicked } from "@/lib/analytics";

type SearchFilterState = {
  openNow: boolean;
  sortNearest: boolean;
  selectedNeighborhood: string;
  selectedPlaceType: string;
  hasPhone: boolean;
  hasWebsite: boolean;
  wheelchairAccessible: boolean;
};

type SearchResultsViewProps = {
  activeFilterLabels: string[];
  emptyStateMessage: string;
  filterState: SearchFilterState;
  hasActiveFilters: boolean;
  initialPerPage: 10 | 20;
  query: string;
  requestLocation: boolean;
  shops: Shop[];
  sortNearest: boolean;
};

const locationDeniedMessage =
  "Location access was not allowed. You can still search by area, postal code, or neighborhood.";
const locationFailedMessage = "Your location could not be detected. You can still search manually.";
const mobileNeighborhoodOptions = [
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

export default function SearchResultsView({
  activeFilterLabels,
  emptyStateMessage,
  filterState,
  hasActiveFilters,
  initialPerPage,
  query,
  requestLocation,
  shops,
  sortNearest
}: SearchResultsViewProps) {
  const [userLocation, setUserLocation] = useState<Coordinates>();
  const [locationMessage, setLocationMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<10 | 20>(initialPerPage);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  useEffect(() => {
    if (!requestLocation) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage(locationFailedMessage);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationMessage("");
      },
      (error) => {
        setLocationMessage(error.code === error.PERMISSION_DENIED ? locationDeniedMessage : locationFailedMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  }, [requestLocation]);

  const visibleShops = useMemo(() => {
    if (!sortNearest || !userLocation) {
      return shops;
    }

    return [...shops].sort(
      (a, b) =>
        getDistanceKm(a, { latitude: userLocation.latitude, longitude: userLocation.longitude }) -
        getDistanceKm(b, { latitude: userLocation.latitude, longitude: userLocation.longitude })
    );
  }, [shops, sortNearest, userLocation]);

  const resultSignature = useMemo(() => shops.map((shop) => shop.slug).join("|"), [shops]);

  useEffect(() => {
    setCurrentPage(1);
  }, [requestLocation, resultSignature, sortNearest]);

  useEffect(() => {
    setPerPage(initialPerPage);
    setCurrentPage(1);
  }, [initialPerPage]);

  const totalResults = visibleShops.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = paginateResults(visibleShops, safeCurrentPage, perPage);
  const firstResultNumber = totalResults === 0 ? 0 : (safeCurrentPage - 1) * perPage + 1;
  const lastResultNumber = Math.min(safeCurrentPage * perPage, totalResults);
  const showPaginationControls = totalResults > perPage;
  const showPerPageControl = totalResults > 10;
  const nearestNeedsLocation = sortNearest && !userLocation && !locationMessage;

  return (
    <>
      <MobileSearchControls
        activeFilterLabels={activeFilterLabels}
        filterState={filterState}
        locationMessage={locationMessage}
        mobileMapOpen={mobileMapOpen}
        onLocationMessage={setLocationMessage}
        onMapToggle={() => setMobileMapOpen((current) => !current)}
        onPerPageChange={(nextPerPage) => {
          setPerPage(nextPerPage);
          setCurrentPage(1);
        }}
        onUserLocation={setUserLocation}
        perPage={perPage}
        query={query}
      />

      <div className="mt-3 grid gap-4 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <aside className="hidden gap-5 lg:col-start-2 lg:row-start-1 lg:grid">
        <div className="lg:sticky lg:top-6">
          <LazyShopMap mobileMode="hidden" shops={visibleShops} userLocation={userLocation} />
        </div>
        <div className="grid gap-5">
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
        </div>
      </aside>

      <div className="grid gap-5 lg:col-start-1 lg:row-start-1">
        <div className="hidden md:block">
          <DisclaimerNotice />
        </div>

        {query ? (
          <div className="hidden rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted md:block">
            Active search: <strong className="text-ink">{query}</strong>
          </div>
        ) : null}

        {nearestNeedsLocation ? (
          <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted">
            Allow location access to sort by nearest.
          </p>
        ) : null}

        {locationMessage ? (
          <p className="hidden rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted md:block" aria-live="polite">
            {locationMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between md:p-4">
          <p className="text-sm text-muted">
            {totalResults > 0 ? (
              <>
                Showing <strong className="text-ink">{firstResultNumber}-{lastResultNumber}</strong> of{" "}
                <strong className="text-ink">{totalResults}</strong> {totalResults === 1 ? "result" : "results"}
                {query ? ` for "${query}"` : ""}.
              </>
            ) : (
              <>
                Showing <strong className="text-ink">0</strong> results{query ? ` for "${query}"` : ""}.
              </>
            )}
          </p>
          {activeFilterLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 md:hidden" aria-label="Active filters">
              {activeFilterLabels.map((label) => (
                <span key={label} className="rounded-md bg-paper px-2 py-1 text-xs font-semibold text-muted">
                  {label}
                </span>
              ))}
            </div>
          ) : null}
          {showPerPageControl ? (
            <label className="hidden flex-col gap-1 text-xs font-bold uppercase text-muted sm:min-w-40 md:flex">
              Results per page
              <select
                className="focus-ring min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold normal-case text-ink"
                onChange={(event) => {
                  setPerPage(Number(event.target.value) === 20 ? 20 : 10);
                  setCurrentPage(1);
                }}
                value={perPage}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </label>
          ) : null}
        </div>

        {totalResults === 0 ? (
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-ink">No matching listings</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{emptyStateMessage}</p>
          </div>
        ) : null}

        {mobileMapOpen ? (
          <div className="lg:hidden">
            <LazyShopMap mobileMode="visible" shops={visibleShops} userLocation={userLocation} />
          </div>
        ) : null}

        <div className={mobileMapOpen ? "hidden lg:grid lg:gap-5" : "grid gap-5"}>
          {paginated.items.map((shop, index) => (
            <div key={shop.slug} className="grid gap-5">
              <ShopCard shop={shop} origin={userLocation} showLiveStatus />
              {index === 2 ? (
                <div className="hidden md:block">
                  <AdSlot placement="in-content" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {!mobileMapOpen && totalResults > 0 ? (
          <div className="md:hidden">
            <AdSlot placement="in-content" />
          </div>
        ) : null}

        {!mobileMapOpen && showPaginationControls ? (
          <PaginationControls currentPage={safeCurrentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
        ) : null}

        <div className="md:hidden">
          <DisclaimerNotice />
        </div>

        {hasActiveFilters && totalResults > 0 ? (
          <p className="text-xs leading-5 text-muted">
            Filters are applied before distance sorting. Location is used only in this browser session.
          </p>
        ) : null}
      </div>
    </div>
    </>
  );
}

function MobileSearchControls({
  activeFilterLabels,
  filterState,
  locationMessage,
  mobileMapOpen,
  onLocationMessage,
  onMapToggle,
  onPerPageChange,
  onUserLocation,
  perPage,
  query
}: {
  activeFilterLabels: string[];
  filterState: SearchFilterState;
  locationMessage: string;
  mobileMapOpen: boolean;
  onLocationMessage: (message: string) => void;
  onMapToggle: () => void;
  onPerPageChange: (perPage: 10 | 20) => void;
  onUserLocation: (coordinates: Coordinates) => void;
  perPage: 10 | 20;
  query: string;
}) {
  const router = useRouter();
  const [mobileQuery, setMobileQuery] = useState(query);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filterState);
  const [pendingPerPage, setPendingPerPage] = useState<10 | 20>(perPage);

  useEffect(() => {
    setMobileQuery(query);
  }, [query]);

  useEffect(() => {
    setPendingFilters(filterState);
  }, [filterState]);

  useEffect(() => {
    setPendingPerPage(perPage);
  }, [perPage]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = mobileQuery.trim();

    trackSearchSubmitted(classifySearchType(trimmed));
    router.push(buildSearchHref(trimmed, pendingFilters, pendingPerPage));
  }

  function handleApplyFilters() {
    onPerPageChange(pendingPerPage);
    setFiltersOpen(false);
    router.push(buildSearchHref(mobileQuery.trim(), pendingFilters, pendingPerPage));
  }

  function handleClearFilters() {
    const clearedFilters: SearchFilterState = {
      openNow: false,
      sortNearest: false,
      selectedNeighborhood: "",
      selectedPlaceType: "",
      hasPhone: false,
      hasWebsite: false,
      wheelchairAccessible: false
    };

    setPendingFilters(clearedFilters);
    setPendingPerPage(10);
    onPerPageChange(10);
    setFiltersOpen(false);
    router.push(buildSearchHref(mobileQuery.trim(), clearedFilters, 10));
  }

  function handleCurrentLocation() {
    trackUseLocationClicked();

    if (!navigator.geolocation) {
      onLocationMessage(locationFailedMessage);
      return;
    }

    onLocationMessage("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextFilters = { ...pendingFilters, sortNearest: true };

        onUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setPendingFilters(nextFilters);
        onLocationMessage("");
        router.push(buildSearchHref(mobileQuery.trim(), nextFilters, pendingPerPage));
      },
      (error) => {
        onLocationMessage(error.code === error.PERMISSION_DENIED ? locationDeniedMessage : locationFailedMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  }

  return (
    <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-white/95 px-4 py-2 shadow-sm backdrop-blur md:hidden">
      <form className="flex items-center gap-2" onSubmit={handleSearchSubmit} role="search">
        <label className="sr-only" htmlFor="mobile-shop-search">
          Search by area, postal code, street, or neighborhood
        </label>
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            id="mobile-shop-search"
            className="focus-ring min-h-11 w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted"
            onChange={(event) => setMobileQuery(event.target.value)}
            placeholder="Area, postal code, street"
            type="search"
            value={mobileQuery}
          />
        </div>
        <button
          aria-label="Search"
          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-teal text-white"
          type="submit"
        >
          <Search aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Use my location"
          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line bg-white text-ink"
          onClick={handleCurrentLocation}
          type="button"
        >
          <LocateFixed aria-hidden="true" size={18} />
        </button>
      </form>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          aria-expanded={filtersOpen}
          className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink"
          onClick={() => setFiltersOpen((current) => !current)}
          type="button"
        >
          <Filter aria-hidden="true" size={16} />
          Filters
          {activeFilterLabels.length > 0 ? (
            <span className="rounded-full bg-teal px-2 py-0.5 text-[11px] text-white">{activeFilterLabels.length}</span>
          ) : null}
        </button>
        <button
          className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"
          onClick={onMapToggle}
          type="button"
        >
          {mobileMapOpen ? <List aria-hidden="true" size={16} /> : <Map aria-hidden="true" size={16} />}
          {mobileMapOpen ? "View list" : "View map"}
        </button>
      </div>

      {filtersOpen ? (
        <div className="mt-2 rounded-lg border border-line bg-white p-3 shadow-sm">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2">
              <MobileCheckbox
                checked={pendingFilters.openNow}
                label="Open now"
                onChange={(checked) => setPendingFilters((current) => ({ ...current, openNow: checked }))}
              />
              <MobileCheckbox
                checked={pendingFilters.sortNearest}
                label="Nearest"
                onChange={(checked) => setPendingFilters((current) => ({ ...current, sortNearest: checked }))}
              />
              <MobileCheckbox
                checked={pendingFilters.hasPhone}
                label="Has phone"
                onChange={(checked) => setPendingFilters((current) => ({ ...current, hasPhone: checked }))}
              />
              <MobileCheckbox
                checked={pendingFilters.hasWebsite}
                label="Has website"
                onChange={(checked) => setPendingFilters((current) => ({ ...current, hasWebsite: checked }))}
              />
              <MobileCheckbox
                checked={pendingFilters.wheelchairAccessible}
                className="col-span-2"
                label="Wheelchair accessible"
                onChange={(checked) => setPendingFilters((current) => ({ ...current, wheelchairAccessible: checked }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-muted" htmlFor="mobile-neighborhood">
                Neighborhood
              </label>
              <select
                className="focus-ring min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                id="mobile-neighborhood"
                onChange={(event) =>
                  setPendingFilters((current) => ({ ...current, selectedNeighborhood: event.target.value }))
                }
                value={pendingFilters.selectedNeighborhood}
              >
                <option value="">All neighborhoods</option>
                {mobileNeighborhoodOptions.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-muted" htmlFor="mobile-place-type">
                Place type
              </label>
              <select
                className="focus-ring min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                id="mobile-place-type"
                onChange={(event) => setPendingFilters((current) => ({ ...current, selectedPlaceType: event.target.value }))}
                value={pendingFilters.selectedPlaceType}
              >
                <option value="">All types</option>
                {placeTypes.map((placeType) => (
                  <option key={placeType.value} value={placeType.value}>
                    {placeType.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-muted" htmlFor="mobile-per-page">
                Results per page
              </label>
              <select
                className="focus-ring min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                id="mobile-per-page"
                onChange={(event) => setPendingPerPage(Number(event.target.value) === 20 ? 20 : 10)}
                value={pendingPerPage}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                className="focus-ring min-h-11 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"
                onClick={handleApplyFilters}
                type="button"
              >
                Apply filters
              </button>
              <button
                className="focus-ring min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink"
                onClick={handleClearFilters}
                type="button"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {locationMessage ? (
        <p className="mt-2 rounded-lg bg-paper px-3 py-2 text-xs leading-5 text-muted" aria-live="polite">
          {locationMessage}
        </p>
      ) : null}
    </div>
  );
}

function MobileCheckbox({
  checked,
  className = "",
  label,
  onChange
}: {
  checked: boolean;
  className?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`flex min-h-10 items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink ${className}`}>
      <input
        checked={checked}
        className="h-4 w-4 accent-teal"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}

function buildSearchHref(query: string, filters: SearchFilterState, perPage: 10 | 20) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (filters.openNow) params.set("openNow", "true");
  if (filters.sortNearest) {
    params.set("sort", "nearest");
    params.set("locate", "true");
  }
  if (filters.selectedNeighborhood) params.set("neighborhood", filters.selectedNeighborhood);
  if (filters.selectedPlaceType) params.set("placeType", filters.selectedPlaceType);
  if (filters.hasPhone) params.set("hasPhone", "true");
  if (filters.hasWebsite) params.set("hasWebsite", "true");
  if (filters.wheelchairAccessible) params.set("accessible", "true");
  if (perPage === 20) params.set("perPage", "20");

  const serialized = params.toString();

  return `/search${serialized ? `?${serialized}` : ""}`;
}

function paginateResults(results: Shop[], currentPage: number, perPage: 10 | 20) {
  const page = Math.max(1, currentPage);
  const start = (page - 1) * perPage;

  return {
    items: results.slice(start, start + perPage)
  };
}

function PaginationControls({
  currentPage,
  onPageChange,
  totalPages
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Search result pages"
      className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap gap-2">
        <button
          className="focus-ring rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-45"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          type="button"
        >
          Previous
        </button>
        <button
          className="focus-ring rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-45"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          type="button"
        >
          Next
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            aria-current={page === currentPage ? "page" : undefined}
            className={`focus-ring min-h-10 min-w-10 rounded-lg border px-3 py-2 text-sm font-bold transition ${
              page === currentPage
                ? "border-teal bg-teal text-white"
                : "border-line bg-white text-ink hover:border-teal hover:text-teal"
            }`}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}
