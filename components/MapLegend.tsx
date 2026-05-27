"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { getPlaceTypeLabel } from "@/data/shops";
import {
  createPlaceTypeMarkerSvg,
  createUserLocationMarkerSvg,
  markerPlaceTypeOrder
} from "@/components/mapMarkerIcons";
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
    <div className="pointer-events-none absolute bottom-2 left-2 z-[450] max-w-[calc(100%-1rem)] md:bottom-3 md:left-3">
      <div className="pointer-events-auto md:hidden">
        {isOpen ? (
          <LegendCard onClose={() => setIsOpen(false)} placeTypes={placeTypes} showUserLocation={showUserLocation} />
        ) : (
          <button
            className="focus-ring rounded-md border border-line bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur"
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
      className="w-[min(64vw,11.25rem)] rounded-md border border-line bg-white/95 p-2 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-bold uppercase leading-none text-ink">Legend</h2>
        {onClose ? (
          <button className="focus-ring rounded px-1 py-0.5 text-[10px] font-bold text-muted" onClick={onClose} type="button">
            Hide
          </button>
        ) : null}
      </div>
      <ul className="mt-1.5 grid gap-1">
        {showUserLocation ? (
          <LegendItem
            icon={
              <span
                className="tn-map-legend-user"
                dangerouslySetInnerHTML={{ __html: createUserLocationMarkerSvg() }}
                aria-hidden="true"
              />
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
    <li className="grid grid-cols-[18px_minmax(0,1fr)] items-center gap-1.5 text-[11px] font-semibold leading-tight text-muted">
      <span className="flex h-5 w-[18px] items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </li>
  );
}
