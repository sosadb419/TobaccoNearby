"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, LocateFixed, MapPin, Train } from "lucide-react";

export default function HomeQuickActions() {
  const [locationStatus, setLocationStatus] = useState("");
  const router = useRouter();

  function handleLocationSearch() {
    if (!navigator.geolocation) {
      setLocationStatus("Location access was not allowed. You can still search by area, postal code, or neighborhood.");
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
        setLocationStatus(
          "Location access was not allowed. You can still search by area, postal code, or neighborhood."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  }

  function revealNeighborhoods() {
    const section = document.getElementById("amsterdam-neighborhoods");
    const heading = document.getElementById("amsterdam-neighborhoods-heading");

    heading?.focus({ preventScroll: true });
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mt-5">
      <p className="text-sm leading-6 text-muted">Quick ways to find practical shop information in Amsterdam.</p>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={handleLocationSearch}
          aria-label="Use my location to find nearby shop listings"
          className="focus-ring flex min-h-20 flex-col justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
        >
          <LocateFixed aria-hidden="true" className="text-teal" size={18} />
          Use my location
        </button>
        <button
          type="button"
          onClick={revealNeighborhoods}
          aria-label="View Amsterdam neighborhood links"
          className="focus-ring flex min-h-20 flex-col justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
        >
          <MapPin aria-hidden="true" className="text-teal" size={18} />
          Search by neighborhood
        </button>
        <Link
          href="/amsterdam/near-central-station"
          aria-label="View shop listings near Amsterdam Central Station"
          className="focus-ring flex min-h-20 flex-col justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
        >
          <Train aria-hidden="true" className="text-teal" size={18} />
          Near Amsterdam Central Station
        </Link>
        <Link
          href="/search?openNow=true"
          aria-label="View listings marked open now"
          className="focus-ring flex min-h-20 flex-col justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
        >
          <Clock aria-hidden="true" className="text-teal" size={18} />
          Open now
        </Link>
      </div>
      {locationStatus ? (
        <p className="mt-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted" aria-live="polite">
          {locationStatus}
        </p>
      ) : null}
    </div>
  );
}
