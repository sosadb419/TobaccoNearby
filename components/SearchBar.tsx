"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, Search } from "lucide-react";

type SearchBarProps = {
  initialQuery?: string;
  compact?: boolean;
  showLocationButton?: boolean;
};

export default function SearchBar({ initialQuery = "", compact = false, showLocationButton = true }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [locationStatus, setLocationStatus] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not available in this browser.");
      return;
    }

    setLocationStatus("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
          sort: "nearest"
        });

        router.push(`/search?${params.toString()}`);
      },
      () => {
        setLocationStatus("Location permission was not granted.");
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  }

  return (
    <div className={compact ? "w-full" : "w-full rounded-lg border border-line bg-white p-3 shadow-soft"}>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit} role="search">
        <label className="sr-only" htmlFor="shop-search">
          Search by area, postal code, street, or neighborhood
        </label>
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            id="shop-search"
            className="focus-ring min-h-12 w-full rounded-lg border border-line bg-white py-3 pl-10 pr-4 text-base text-ink placeholder:text-muted"
            placeholder="Search by area, postal code, street, or neighborhood"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg bg-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-ink"
          type="submit"
        >
          Search
        </button>
        {showLocationButton ? (
          <button
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
            type="button"
            onClick={handleCurrentLocation}
          >
            <LocateFixed aria-hidden="true" size={18} />
            Use my current location
          </button>
        ) : null}
      </form>
      <p className="mt-3 text-sm text-muted">Examples: De Pijp, Bijlmer, 1012, Amsterdam Centraal</p>
      {showLocationButton && locationStatus ? (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {locationStatus}
        </p>
      ) : null}
    </div>
  );
}
