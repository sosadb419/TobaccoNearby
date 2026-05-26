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

        <p className="text-sm text-muted">
          Showing <strong className="text-ink">{visibleShops.length}</strong>{" "}
          {visibleShops.length === 1 ? "listing" : "listings"}
          {query ? ` for "${query}"` : ""}.
        </p>

        {visibleShops.length === 0 ? (
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-ink">No matching listings</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{emptyStateMessage}</p>
          </div>
        ) : null}

        {visibleShops.map((shop, index) => (
          <div key={shop.slug} className="grid gap-5">
            <ShopCard shop={shop} origin={userLocation} showLiveStatus />
            {index === 2 ? <AdSlot placement="in-content" /> : null}
          </div>
        ))}

        {hasActiveFilters && visibleShops.length > 0 ? (
          <p className="text-xs leading-5 text-muted">
            Filters are applied before distance sorting. Location is used only in this browser session.
          </p>
        ) : null}
      </div>
    </div>
  );
}
