"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, LocateFixed, MapPin, Train } from "lucide-react";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { trackUseLocationClicked } from "@/lib/analytics";

const locationDeniedMessage =
  "Location access was not allowed. You can still search by area, postal code, or neighborhood.";
const locationFailedMessage = "Your location could not be detected. You can still search manually.";

type HomeQuickActionsProps = {
  className?: string;
};

export default function HomeQuickActions({ className = "" }: HomeQuickActionsProps) {
  const [locationStatus, setLocationStatus] = useState("");
  const router = useRouter();

  function handleLocationSearch() {
    trackUseLocationClicked();

    if (!navigator.geolocation) {
      setLocationStatus(locationFailedMessage);
      return;
    }

    setLocationStatus("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      () => {
        const params = new URLSearchParams({
          sort: "nearest",
          locate: "true"
        });

        router.push(`/search?${params.toString()}`);
      },
      (error) => {
        setLocationStatus(error.code === error.PERMISSION_DENIED ? locationDeniedMessage : locationFailedMessage);
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
    <div className={className}>
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={handleLocationSearch}
          aria-label="Use my location to find nearby shop listings"
          className="focus-ring flex min-h-14 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal md:min-h-20 md:flex-col md:items-start md:justify-center md:py-3"
        >
          <LocateFixed aria-hidden="true" className="text-teal" size={18} />
          Use my location
        </button>
        <Link
          href="/search?openNow=true"
          aria-label="View listings marked open now"
          className="focus-ring flex min-h-14 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal md:min-h-20 md:flex-col md:items-start md:justify-center md:py-3"
        >
          <Clock aria-hidden="true" className="text-teal" size={18} />
          Open now
        </Link>
        <TrackedNeighborhoodLink
          href="/amsterdam/near-central-station"
          neighborhood="Amsterdam Central Station"
          aria-label="View shop listings near Amsterdam Central Station"
          className="focus-ring flex min-h-14 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal md:min-h-20 md:flex-col md:items-start md:justify-center md:py-3"
        >
          <Train aria-hidden="true" className="text-teal" size={18} />
          Near Central Station
        </TrackedNeighborhoodLink>
        <button
          type="button"
          onClick={revealNeighborhoods}
          aria-label="View Amsterdam neighborhood links"
          className="focus-ring flex min-h-14 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-teal hover:text-teal md:min-h-20 md:flex-col md:items-start md:justify-center md:py-3"
        >
          <MapPin aria-hidden="true" className="text-teal" size={18} />
          Browse neighborhoods
        </button>
      </div>
      {locationStatus ? (
        <p className="mt-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-6 text-muted" aria-live="polite">
          {locationStatus}
        </p>
      ) : null}
    </div>
  );
}
