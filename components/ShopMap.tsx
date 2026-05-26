"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDirectionsUrl, getPlaceTypeLabel, getTodayOpeningHours, Shop, type Coordinates } from "@/data/shops";
import { trackDirectionsClicked, trackShopDetailsClicked } from "@/lib/analytics";

type ShopMapProps = {
  shops: Shop[];
  userLocation?: Coordinates;
};

type LeafletMap = {
  fitBounds: (bounds: Array<[number, number]>, options?: Record<string, unknown>) => void;
  remove: () => void;
  setView: (center: [number, number], zoom: number) => void;
};

type LeafletLayerGroup = {
  addTo: (map: LeafletMap) => LeafletLayerGroup;
  clearLayers: () => void;
};

type LeafletMarker = {
  addTo: (target: LeafletMap | LeafletLayerGroup) => LeafletMarker;
  bindPopup: (content: HTMLElement) => LeafletMarker;
};

type LeafletLike = {
  circle: (coordinates: [number, number], options: Record<string, unknown>) => LeafletMarker;
  divIcon: (options: Record<string, unknown>) => unknown;
  layerGroup: () => LeafletLayerGroup;
  map: (element: HTMLDivElement, options?: Record<string, unknown>) => LeafletMap;
  marker: (coordinates: [number, number], options?: Record<string, unknown>) => LeafletMarker;
  tileLayer: (
    url: string,
    options: Record<string, unknown>
  ) => {
    addTo: (map: LeafletMap) => unknown;
  };
};

declare global {
  interface Window {
    L?: LeafletLike;
  }
}

const amsterdamCenter: [number, number] = [52.3676, 4.9041];
const leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const leafletScriptUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

export default function ShopMap({ shops, userLocation }: ShopMapProps) {
  const [leaflet, setLeaflet] = useState<LeafletLike | null>(null);
  const [loadError, setLoadError] = useState(false);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletLayerGroup | null>(null);
  const visibleShops = useMemo(() => shops.filter(hasValidCoordinates), [shops]);

  useEffect(() => {
    let isMounted = true;

    loadLeaflet()
      .then((loadedLeaflet) => {
        if (isMounted) {
          setLeaflet(loadedLeaflet);
        }
      })
      .catch((error) => {
        console.error("Leaflet failed to load.", error);
        if (isMounted) {
          setLoadError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !mapElementRef.current || mapRef.current) {
      return;
    }

    const map = leaflet.map(mapElementRef.current, {
      scrollWheelZoom: false
    });

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      })
      .addTo(map);

    markersRef.current = leaflet.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    if (!leaflet || !mapRef.current || !markersRef.current) {
      return;
    }

    const map = mapRef.current;
    const markers = markersRef.current;
    markers.clearLayers();

    visibleShops.forEach((shop) => {
      leaflet
        .marker([shop.latitude, shop.longitude], {
          icon: getMarkerIcon(leaflet, shop.place_type)
        })
        .bindPopup(createShopPopup(shop))
        .addTo(markers);
    });

    if (userLocation) {
      leaflet
        .marker([userLocation.latitude, userLocation.longitude], {
          icon: getUserLocationIcon(leaflet)
        })
        .bindPopup(createTextPopup("You are here"))
        .addTo(markers);

      leaflet
        .circle([userLocation.latitude, userLocation.longitude], {
          color: "#0f766e",
          fillColor: "#0f766e",
          fillOpacity: 0.12,
          radius: 180
        })
        .addTo(markers);
    }

    const bounds: Array<[number, number]> = visibleShops.map((shop) => [shop.latitude, shop.longitude]);

    if (userLocation) {
      bounds.push([userLocation.latitude, userLocation.longitude]);
    }

    if (bounds.length > 1) {
      map.fitBounds(bounds, { maxZoom: 15, padding: [28, 28] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else {
      map.setView(amsterdamCenter, 12);
    }
  }, [leaflet, visibleShops, userLocation]);

  return (
    <section className="rounded-lg border border-line bg-white p-3 shadow-sm" aria-label="Map of shop locations">
      {loadError ? (
        <div className="flex h-[360px] items-center justify-center rounded-lg border border-line bg-paper p-5 text-center text-sm leading-6 text-muted lg:h-[520px]">
          The map could not be loaded right now. The shop list remains available below.
        </div>
      ) : (
        <div
          ref={mapElementRef}
          className="h-[360px] overflow-hidden rounded-lg bg-paper lg:h-[520px]"
          aria-label="Map of visible TobaccoNearby shop listings"
        />
      )}
      <p className="mt-3 text-xs leading-5 text-muted">
        Map locations are approximate. Marker icons indicate place type. Please verify details before visiting.
      </p>
      <MapLegend />
    </section>
  );
}

function hasValidCoordinates(shop: Shop) {
  return Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude);
}

function getMarkerIcon(leaflet: LeafletLike, placeType?: string) {
  const type = normalizePlaceType(placeType);
  const icon = markerIconConfig[type];

  return leaflet.divIcon({
    className: `tn-map-marker tn-map-marker-${type}`,
    html: createMarkerSvg(icon.color, icon.symbol),
    iconAnchor: [14, 36],
    iconSize: [28, 38],
    popupAnchor: [0, -34]
  });
}

function getUserLocationIcon(leaflet: LeafletLike) {
  return leaflet.divIcon({
    className: "tn-map-marker tn-user-location-marker",
    html: '<img src="/icons/user-smoker-marker.png" alt="" aria-hidden="true" />',
    iconAnchor: [21, 42],
    iconSize: [42, 42],
    popupAnchor: [0, -40]
  });
}

const markerIconConfig = {
  tobacco_shop: {
    color: "#0f766e",
    symbol:
      '<path d="M9 19h14v9H9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 19h18l-2.2-4.8H9.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 28v-5h4v5M14 14h4m-2 0v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  kiosk: {
    color: "#2563eb",
    symbol:
      '<path d="M9 28V18h14v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 18h18l-3-4.5H10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 22h8M13 28v-4h6v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  gas_station: {
    color: "#b45309",
    symbol:
      '<path d="M10 28V13h9v15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12.5 16h4v4h-4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 16h2.5l2 2.6V26a2 2 0 0 1-4 0v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 28h12.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  convenience_store: {
    color: "#4d7c0f",
    symbol:
      '<path d="M9.5 19h13l-1.3 9h-10.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13 19a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13.5 23.5h5M16 21v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  night_shop: {
    color: "#4f46e5",
    symbol:
      '<path d="M9 28V18h14v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 18h18l-3-4.5H10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 28v-4h4v4M20 23h1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 13a4 4 0 0 0 3.5 5.3 4.5 4.5 0 0 1-5.4-5.4z" fill="currentColor"/>'
  },
  other: {
    color: "#64748b",
    symbol:
      '<path d="M16 28s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="18" r="2.2" fill="currentColor"/>'
  }
} as const;

function normalizePlaceType(placeType?: string): keyof typeof markerIconConfig {
  const value = placeType?.trim().toLowerCase();

  if (
    value === "tobacco_shop" ||
    value === "kiosk" ||
    value === "gas_station" ||
    value === "convenience_store" ||
    value === "night_shop" ||
    value === "other"
  ) {
    return value;
  }

  return "tobacco_shop";
}

function createMarkerSvg(color: string, symbol: string) {
  return `<svg class="tn-marker-svg" viewBox="0 0 32 40" role="img" aria-hidden="true" focusable="false" style="color:${color}" xmlns="http://www.w3.org/2000/svg"><path class="tn-marker-shadow" d="M16 39c5.4-6.8 12-12.4 12-22A12 12 0 0 0 4 17c0 9.6 6.6 15.2 12 22z"/><path class="tn-marker-pin" d="M16 37c5.1-6.5 10.5-11.2 10.5-20.2A10.5 10.5 0 0 0 5.5 16.8C5.5 25.8 10.9 30.5 16 37z"/><g class="tn-marker-symbol">${symbol}</g></svg>`;
}

function MapLegend() {
  const items = [
    { label: "Your location", swatchClass: "bg-ink" },
    { label: "Tobacco shop", swatchClass: "bg-teal" },
    { label: "Kiosk", swatchClass: "bg-blue-600" },
    { label: "Gas station", swatchClass: "bg-amber-700" }
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted" aria-label="Map marker legend">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 rounded-md border border-line bg-paper px-2 py-1">
          <span className={`h-2.5 w-2.5 rounded-sm ${item.swatchClass}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function createShopPopup(shop: Shop) {
  const container = document.createElement("div");
  container.className = "tn-map-popup";

  const title = document.createElement("p");
  title.className = "tn-map-popup-title";
  title.textContent = shop.name;
  container.append(title);

  const address = document.createElement("p");
  address.textContent = shop.address;
  container.append(address);

  const neighborhood = document.createElement("p");
  neighborhood.textContent = `Neighborhood: ${shop.neighborhood}`;
  container.append(neighborhood);

  const placeType = document.createElement("p");
  placeType.textContent = `Place type: ${getPlaceTypeLabel(shop.place_type)}`;
  container.append(placeType);

  const hours = document.createElement("p");
  hours.textContent = `Today: ${getTodayOpeningHours(shop)}`;
  container.append(hours);

  const links = document.createElement("div");
  links.className = "tn-map-popup-links";

  const detailsLink = document.createElement("a");
  detailsLink.href = `/shops/${shop.slug}`;
  detailsLink.textContent = "View details";
  detailsLink.addEventListener("click", () => trackShopDetailsClicked(shop.slug, shop.neighborhood));
  links.append(detailsLink);

  const directionsUrl = getDirectionsUrl(shop);

  if (directionsUrl) {
    const directionsLink = document.createElement("a");
    directionsLink.href = directionsUrl;
    directionsLink.rel = "noreferrer";
    directionsLink.target = "_blank";
    directionsLink.textContent = "Directions";
    directionsLink.addEventListener("click", () => trackDirectionsClicked(shop.slug, shop.neighborhood));
    links.append(directionsLink);
  }

  container.append(links);

  return container;
}

function createTextPopup(text: string) {
  const container = document.createElement("div");
  container.className = "tn-map-popup";
  container.textContent = text;

  return container;
}

function loadLeaflet() {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  ensureLeafletCss();

  return new Promise<LeafletLike>((resolve, reject) => {
    const existingScript = document.getElementById("leaflet-script") as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => (window.L ? resolve(window.L) : reject(new Error("Leaflet unavailable"))), {
        once: true
      });
      existingScript.addEventListener("error", () => reject(new Error("Leaflet script failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-script";
    script.async = true;
    script.src = leafletScriptUrl;
    script.onload = () => (window.L ? resolve(window.L) : reject(new Error("Leaflet unavailable")));
    script.onerror = () => reject(new Error("Leaflet script failed"));
    document.body.append(script);
  });
}

function ensureLeafletCss() {
  if (document.getElementById("leaflet-css")) {
    return;
  }

  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = leafletCssUrl;
  document.head.append(link);
}
