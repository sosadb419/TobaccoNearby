"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MapLegend from "@/components/MapLegend";
import {
  createPlaceTypeMarkerSvg,
  createUserLocationMarkerSvg,
  normalizeMarkerPlaceType
} from "@/components/mapMarkerIcons";
import {
  getDirectionsUrl,
  getOpeningStatusLabel,
  getPlaceTypeLabel,
  getTodayOpeningHours,
  Shop,
  type Coordinates
} from "@/data/shops";
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
  bindPopup: (content: HTMLElement, options?: Record<string, unknown>) => LeafletMarker;
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
  const visiblePlaceTypes = useMemo(
    () => Array.from(new Set(visibleShops.map((shop) => normalizeMarkerPlaceType(shop.place_type)))),
    [visibleShops]
  );

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
        .bindPopup(createShopPopup(shop), {
          className: "tn-map-card-popup",
          maxWidth: 286,
          minWidth: 238
        })
        .addTo(markers);
    });

    if (userLocation) {
      leaflet
        .circle([userLocation.latitude, userLocation.longitude], {
          color: "#14b8a6",
          fillColor: "#14b8a6",
          fillOpacity: 0.055,
          opacity: 0.38,
          radius: 140,
          weight: 2
        })
        .addTo(markers);

      leaflet
        .marker([userLocation.latitude, userLocation.longitude], {
          icon: getUserLocationIcon(leaflet)
        })
        .bindPopup(createTextPopup("You are here"))
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
        <div className="relative">
          <div
            ref={mapElementRef}
            className="h-[360px] overflow-hidden rounded-lg bg-paper lg:h-[520px]"
            aria-label="Map of visible TobaccoNearby shop listings"
          />
          <MapLegend showUserLocation={Boolean(userLocation)} visiblePlaceTypes={visiblePlaceTypes} />
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-muted">
        Map locations are approximate. Marker icons indicate place type. Please verify details before visiting.
      </p>
    </section>
  );
}

function hasValidCoordinates(shop: Shop) {
  return Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude);
}

function getMarkerIcon(leaflet: LeafletLike, placeType?: string) {
  const type = normalizeMarkerPlaceType(placeType);

  return leaflet.divIcon({
    className: `tn-map-marker tn-map-marker-${type}`,
    html: createPlaceTypeMarkerSvg(type),
    iconAnchor: [14, 36],
    iconSize: [28, 38],
    popupAnchor: [0, -34]
  });
}

function getUserLocationIcon(leaflet: LeafletLike) {
  return leaflet.divIcon({
    className: "tn-map-marker tn-user-location-marker",
    html: createUserLocationMarkerSvg(),
    iconAnchor: [22, 54],
    iconSize: [44, 56],
    popupAnchor: [0, -52]
  });
}

function createShopPopup(shop: Shop) {
  const container = document.createElement("article");
  container.className = "tn-map-popup";
  const placeTypeLabel = getPlaceTypeLabel(shop.place_type);

  const header = document.createElement("div");
  header.className = "tn-map-popup-header";

  const title = document.createElement("h3");
  title.className = "tn-map-popup-title";
  title.textContent = shop.name;
  header.append(title);

  const badge = document.createElement("span");
  badge.className = "tn-map-popup-badge";
  badge.textContent = placeTypeLabel;
  header.append(badge);
  container.append(header);

  const rows = document.createElement("div");
  rows.className = "tn-map-popup-rows";

  const addressText = [shop.address, [shop.postalCode, shop.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const openingStatusLabel = getOpeningStatusLabel(shop);
  const todayOpeningHours = getTodayOpeningHours(shop);
  const openingText =
    todayOpeningHours === "Opening hours not available"
      ? openingStatusLabel
      : `${openingStatusLabel}. Today: ${todayOpeningHours}`;

  rows.append(
    createPopupRow("pin", addressText || "Address not available"),
    createPopupRow("map", shop.neighborhood),
    createPopupRow(normalizeMarkerPlaceType(shop.place_type), placeTypeLabel),
    createPopupRow("clock", openingText)
  );
  container.append(rows);

  const links = document.createElement("div");
  links.className = "tn-map-popup-actions";

  const detailsLink = document.createElement("a");
  detailsLink.className = "tn-map-popup-button tn-map-popup-button-primary";
  detailsLink.href = `/shops/${shop.slug}`;
  detailsLink.textContent = "View details";
  detailsLink.addEventListener("click", () => trackShopDetailsClicked(shop.slug, shop.neighborhood));
  links.append(detailsLink);

  const directionsUrl = getDirectionsUrl(shop);

  if (directionsUrl) {
    const directionsLink = document.createElement("a");
    directionsLink.className = "tn-map-popup-button tn-map-popup-button-secondary";
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

function createPopupRow(iconName: keyof typeof popupIconConfig, text: string) {
  const row = document.createElement("div");
  row.className = "tn-map-popup-row";
  row.append(createPopupIcon(iconName));

  const value = document.createElement("span");
  value.textContent = text;
  row.append(value);

  return row;
}

function createPopupIcon(iconName: keyof typeof popupIconConfig) {
  const icon = popupIconConfig[iconName];
  const wrapper = document.createElement("span");
  wrapper.className = "tn-map-popup-icon";
  wrapper.style.color = icon.color;
  wrapper.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${icon.svg}</svg>`;

  return wrapper;
}

const popupIconConfig = {
  pin: {
    color: "#0f766e",
    svg:
      '<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2" fill="currentColor"/>'
  },
  map: {
    color: "#0f766e",
    svg:
      '<path d="M9 18l-5 2V6l5-2 6 2 5-2v14l-5 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  clock: {
    color: "#0f766e",
    svg:
      '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v4l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  tobacco_shop: {
    color: "#0f766e",
    svg:
      '<path d="M5 20V9h14v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 9h16l-2-4H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 20v-5h4v5M10 5h4m-2 0v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  kiosk: {
    color: "#2563eb",
    svg:
      '<path d="M5 20V10h14v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 10h16l-3-5H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 14h6M10 20v-4h4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  gas_station: {
    color: "#b45309",
    svg:
      '<path d="M7 20V5h8v15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8h4v4H9z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 8h2l2 2.5V18a2 2 0 0 1-4 0v-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 20h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  convenience_store: {
    color: "#4d7c0f",
    svg:
      '<path d="M6 10h12l-1 10H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 10a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.5 15h5M12 12.5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  night_shop: {
    color: "#4f46e5",
    svg:
      '<path d="M5 20V10h14v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 10h16l-3-5H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 20v-4h4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 5a4 4 0 0 0 3.4 5.1 4.5 4.5 0 0 1-5.5-5.5z" fill="currentColor"/>'
  },
  other: {
    color: "#64748b",
    svg:
      '<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2" fill="currentColor"/>'
  }
} as const;

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
