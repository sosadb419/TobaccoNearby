"use client";

import { useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import LazyShopMap from "@/components/LazyShopMap";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { Coordinates, Shop, getDistanceKm, neighborhoods } from "@/data/shops";

type SearchResultsViewProps = {
  emptyStateMessage: string;
  hasActiveFilters: boolean;
  query: string;
  requestLocation: boolean;
  shops: Shop[];
  sortNearest: boolean;
};

const locationDeniedMessage =
  "Location access was not allowed. You can still search by area, postal code, or neighborhood.";
const locationFailedMessage = "Your location could not be detected. You can still search manually.";

export default function SearchResultsView({
  emptyStateMessage,
  hasActiveFilters,
  query,
  requestLocation,
  shops,
  sortNearest
}: SearchResultsViewProps) {
  const [userLocation, setUserLocation] = useState<Coordinates>();
  const [locationMessage, setLocationMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<10 | 20>(10);

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
    <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <aside className="grid gap-5 lg:col-start-2 lg:row-start-1">
        <div className="lg:sticky lg:top-6">
          <LazyShopMap shops={visibleShops} userLocation={userLocation} />
        </div>
        <div className="hidden gap-5 lg:grid">
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
        <DisclaimerNotice />

        {query ? (
          <div className="rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted">
            Active search: <strong className="text-ink">{query}</strong>
          </div>
        ) : null}

        {nearestNeedsLocation ? (
          <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted">
            Allow location access to sort by nearest.
          </p>
        ) : null}

        {locationMessage ? (
          <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted" aria-live="polite">
            {locationMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
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
          {showPerPageControl ? (
            <label className="flex flex-col gap-1 text-xs font-bold uppercase text-muted sm:min-w-40">
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

        {paginated.items.map((shop, index) => (
          <div key={shop.slug} className="grid gap-5">
            <ShopCard shop={shop} origin={userLocation} showLiveStatus />
            {index === 2 ? <AdSlot placement="in-content" /> : null}
          </div>
        ))}

        {showPaginationControls ? (
          <PaginationControls
            currentPage={safeCurrentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        ) : null}

        {hasActiveFilters && totalResults > 0 ? (
          <p className="text-xs leading-5 text-muted">
            Filters are applied before distance sorting. Location is used only in this browser session.
          </p>
        ) : null}
      </div>
    </div>
  );
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
