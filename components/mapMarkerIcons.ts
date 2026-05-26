export const markerIconConfig = {
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

export type MarkerPlaceType = keyof typeof markerIconConfig;

export const markerPlaceTypeOrder: MarkerPlaceType[] = [
  "tobacco_shop",
  "kiosk",
  "gas_station",
  "convenience_store",
  "night_shop",
  "other"
];

export function normalizeMarkerPlaceType(placeType?: string): MarkerPlaceType {
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

export function createMarkerSvg(color: string, symbol: string) {
  return `<svg class="tn-marker-svg" viewBox="0 0 32 40" role="img" aria-hidden="true" focusable="false" style="color:${color}" xmlns="http://www.w3.org/2000/svg"><path class="tn-marker-shadow" d="M16 39c5.4-6.8 12-12.4 12-22A12 12 0 0 0 4 17c0 9.6 6.6 15.2 12 22z"/><path class="tn-marker-pin" d="M16 37c5.1-6.5 10.5-11.2 10.5-20.2A10.5 10.5 0 0 0 5.5 16.8C5.5 25.8 10.9 30.5 16 37z"/><g class="tn-marker-symbol">${symbol}</g></svg>`;
}

export function createPlaceTypeMarkerSvg(placeType?: string) {
  const icon = markerIconConfig[normalizeMarkerPlaceType(placeType)];

  return createMarkerSvg(icon.color, icon.symbol);
}
