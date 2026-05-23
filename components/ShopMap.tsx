"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getTodayOpeningHours, Shop, type Coordinates } from "@/data/shops";
import { trackDirectionsClicked, trackShopDetailsClicked } from "@/lib/analytics";

type ShopMapProps = {
  shops: Shop[];
  userLocation?: Coordinates;
  collapsibleOnMobile?: boolean;
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

export default function ShopMap({ shops, userLocation, collapsibleOnMobile = false }: ShopMapProps) {
  const [isMapVisible, setIsMapVisible] = useState(!collapsibleOnMobile);
  const [leaflet, setLeaflet] = useState<LeafletLike | null>(null);
  const [loadError, setLoadError] = useState(false);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletLayerGroup | null>(null);
  const visibleShops = useMemo(() => shops.filter(hasValidCoordinates), [shops]);

  useEffect(() => {
    if (!isMapVisible) {
      return;
    }

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
  }, [isMapVisible]);

  useEffect(() => {
    if (!leaflet || !mapElementRef.current || mapRef.current || !isMapVisible) {
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
  }, [leaflet, isMapVisible]);

  useEffect(() => {
    if (!leaflet || !mapRef.current || !markersRef.current || !isMapVisible) {
      return;
    }

    const map = mapRef.current;
    const markers = markersRef.current;
    markers.clearLayers();

    visibleShops.forEach((shop) => {
      leaflet
        .marker([shop.latitude, shop.longitude], {
          icon: leaflet.divIcon({
            className: "tn-map-marker",
            html: "<span></span>",
            iconAnchor: [12, 12],
            iconSize: [24, 24],
            popupAnchor: [0, -10]
          })
        })
        .bindPopup(createShopPopup(shop))
        .addTo(markers);
    });

    if (userLocation) {
      leaflet
        .circle([userLocation.latitude, userLocation.longitude], {
          color: "#0f766e",
          fillColor: "#0f766e",
          fillOpacity: 0.12,
          radius: 180
        })
        .bindPopup(createTextPopup("Approximate location"))
        .addTo(markers);
    }

    if (visibleShops.length > 0) {
      map.fitBounds(
        visibleShops.map((shop) => [shop.latitude, shop.longitude]),
        { maxZoom: 15, padding: [28, 28] }
      );
    } else {
      map.setView(amsterdamCenter, 12);
    }
  }, [leaflet, visibleShops, userLocation, isMapVisible]);

  return (
    <section className="rounded-lg border border-line bg-white p-3 shadow-sm" aria-label="Map of shop locations">
      {collapsibleOnMobile ? (
        <button
          type="button"
          aria-controls="mobile-shop-map"
          aria-expanded={isMapVisible}
          aria-label={isMapVisible ? "View list of shop results" : "View map of shop results"}
          onClick={() => setIsMapVisible((current) => !current)}
          className="focus-ring w-full rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-teal"
        >
          {isMapVisible ? "View list" : "View map"}
        </button>
      ) : null}

      {isMapVisible ? (
        <div className={collapsibleOnMobile ? "mt-3" : ""} id={collapsibleOnMobile ? "mobile-shop-map" : undefined}>
          {loadError ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-line bg-paper p-5 text-center text-sm leading-6 text-muted">
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
            Map locations are approximate. Please verify details before visiting.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function hasValidCoordinates(shop: Shop) {
  return Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude);
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

  const directionsLink = document.createElement("a");
  directionsLink.href = shop.googleMapsLink;
  directionsLink.rel = "noreferrer";
  directionsLink.target = "_blank";
  directionsLink.textContent = "Directions";
  directionsLink.addEventListener("click", () => trackDirectionsClicked(shop.slug, shop.neighborhood));
  links.append(directionsLink);

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
