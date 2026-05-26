"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { getPlaceTypeLabel } from "@/data/shops";
import { createPlaceTypeMarkerSvg, markerPlaceTypeOrder } from "@/components/mapMarkerIcons";
import type { MarkerPlaceType } from "@/components/mapMarkerIcons";

type MapLegendProps = {
  showUserLocation: boolean;
  visiblePlaceTypes: MarkerPlaceType[];
};

export default function MapLegend({ showUserLocation, visiblePlaceTypes }: MapLegendProps) {
  const [isOpen, setIsOpen] = useState(false);
  const placeTypes = useMemo(() => {
    const visibleSet = new Set(visiblePlaceTypes);

    return markerPlaceTypeOrder.filter((placeType) => visibleSet.has(placeType));
  }, [visiblePlaceTypes]);

  if (!showUserLocation && placeTypes.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-[450] max-w-[calc(100%-1.5rem)]">
      <div className="pointer-events-auto md:hidden">
        {isOpen ? (
          <LegendCard onClose={() => setIsOpen(false)} placeTypes={placeTypes} showUserLocation={showUserLocation} />
        ) : (
          <button
            className="focus-ring rounded-lg border border-line bg-white/95 px-3 py-2 text-xs font-bold text-ink shadow-sm backdrop-blur"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            Legend
          </button>
        )}
      </div>
      <div className="pointer-events-auto hidden md:block">
        <LegendCard placeTypes={placeTypes} showUserLocation={showUserLocation} />
      </div>
    </div>
  );
}

function LegendCard({
  onClose,
  placeTypes,
  showUserLocation
}: {
  onClose?: () => void;
  placeTypes: MarkerPlaceType[];
  showUserLocation: boolean;
}) {
  return (
    <section
      aria-label="Map legend"
      className="w-[min(78vw,15rem)] rounded-lg border border-line bg-white/95 p-3 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase text-ink">Map legend</h2>
        {onClose ? (
          <button className="focus-ring rounded-md px-1.5 py-1 text-xs font-bold text-muted" onClick={onClose} type="button">
            Hide
          </button>
        ) : null}
      </div>
      <ul className="mt-2 grid gap-1.5">
        {showUserLocation ? (
          <LegendItem
            icon={
              <span className="tn-map-legend-user" aria-hidden="true">
                <img src="/icons/user-smoker-marker.png" alt="" />
              </span>
            }
            label="Your location"
          />
        ) : null}
        {placeTypes.map((placeType) => (
          <LegendItem
            key={placeType}
            icon={
              <span
                className="tn-map-legend-marker"
                dangerouslySetInnerHTML={{ __html: createPlaceTypeMarkerSvg(placeType) }}
                aria-hidden="true"
              />
            }
            label={getPlaceTypeLabel(placeType)}
          />
        ))}
      </ul>
    </section>
  );
}

function LegendItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="grid grid-cols-[24px_minmax(0,1fr)] items-center gap-2 text-xs font-semibold text-muted">
      <span className="flex h-7 w-6 items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </li>
  );
}
