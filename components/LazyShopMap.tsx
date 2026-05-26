"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useState } from "react";
import type { Coordinates, Shop } from "@/data/shops";

const DynamicShopMap = dynamic(() => import("@/components/ShopMap"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />
});

type LazyShopMapProps = {
  mobileMode?: "hidden" | "toggle" | "visible";
  shops: Shop[];
  userLocation?: Coordinates;
};

export default function LazyShopMap({ mobileMode = "toggle", shops, userLocation }: LazyShopMapProps) {
  const [loadDesktopMap, setLoadDesktopMap] = useState(false);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => setLoadDesktopMap(desktopViewport.matches);

    syncViewport();
    desktopViewport.addEventListener("change", syncViewport);

    return () => desktopViewport.removeEventListener("change", syncViewport);
  }, []);

  return (
    <>
      <div className="hidden lg:block">
        {loadDesktopMap ? (
          <DynamicShopMap shops={shops} userLocation={userLocation} />
        ) : (
          <MapLoadingPlaceholder />
        )}
      </div>
      <div className="lg:hidden">
        {mobileMode === "toggle" ? <MobileMapToggle shops={shops} userLocation={userLocation} /> : null}
        {mobileMode === "visible" ? <DynamicShopMap shops={shops} userLocation={userLocation} /> : null}
      </div>
    </>
  );
}

function MobileMapToggle({ shops, userLocation }: LazyShopMapProps) {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRegionId = useId();

  return (
    <div className="grid gap-3">
      <button
        type="button"
        aria-controls={mapRegionId}
        aria-expanded={isMapVisible}
        aria-label={isMapVisible ? "View list of shop results" : "View map of shop results"}
        onClick={() => setIsMapVisible((current) => !current)}
        className="focus-ring w-full rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-teal"
      >
        {isMapVisible ? "View list" : "View map"}
      </button>
      {isMapVisible ? (
        <div id={mapRegionId}>
          <DynamicShopMap shops={shops} userLocation={userLocation} />
        </div>
      ) : null}
    </div>
  );
}

function MapLoadingPlaceholder() {
  return (
    <section className="rounded-lg border border-line bg-white p-3 shadow-sm" aria-label="Loading map of shop locations">
      <div className="flex h-[360px] items-center justify-center rounded-lg bg-paper text-sm text-muted lg:h-[520px]">
        Loading map...
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Map locations are approximate. Please verify details before visiting.
      </p>
    </section>
  );
}
