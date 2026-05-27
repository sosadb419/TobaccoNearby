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

export function createUserLocationMarkerSvg() {
  return `<svg class="tn-user-marker-svg" viewBox="0 0 72 92" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="tn-user-marker-halo-fill" cx="35" cy="84" rx="24" ry="7.5"/>
  <ellipse class="tn-user-marker-halo-ring" cx="35" cy="84" rx="24" ry="7.5"/>
  <circle class="tn-user-marker-head-fill" cx="31.5" cy="24" r="15"/>
  <g class="tn-user-marker-outline">
    <circle cx="31.5" cy="24" r="15"/>
    <path d="M21 10c3.6-4 8.4-3.4 11.2 1.7M32.5 9.4c4-2 8.1-.7 10.2 3.1"/>
    <path d="M31 39c-.6 7.5-1.4 14.7 1.5 22.2M31.5 41 16 56M32.8 60l-14.2 24M33 60 53.5 84"/>
    <path d="M37 40 51 56M51 56 45 33M45 33l11.8-2.5"/>
    <path d="M44.2 29.4 56.5 32M49.5 30.5l-2.8 6.3M56.5 32c3.6 1.2 5.5-3.1 2.1-5.2"/>
    <path d="M58 25c6.5-7.5-5.2-9.7 3.4-18M58.2 31c8.1-7.2 6.4-13.9 1.6-18.5"/>
    <path d="M23 22.5c-1.5.5-2.6 1.7-3.2 3M32 18.5c4.5-2.6 8-1.4 10.4 2.2M21 32.8c7.8-.8 16-3.5 21.2-.8"/>
  </g>
  <g class="tn-user-marker-line">
    <circle cx="31.5" cy="24" r="15"/>
    <path d="M21 10c3.6-4 8.4-3.4 11.2 1.7M32.5 9.4c4-2 8.1-.7 10.2 3.1"/>
    <path d="M31 39c-.6 7.5-1.4 14.7 1.5 22.2M31.5 41 16 56M32.8 60l-14.2 24M33 60 53.5 84"/>
    <path d="M37 40 51 56M51 56 45 33M45 33l11.8-2.5"/>
    <path d="M44.2 29.4 56.5 32M49.5 30.5l-2.8 6.3M56.5 32c3.6 1.2 5.5-3.1 2.1-5.2"/>
    <path d="M58 25c6.5-7.5-5.2-9.7 3.4-18M58.2 31c8.1-7.2 6.4-13.9 1.6-18.5"/>
    <path d="M23 22.5c-1.5.5-2.6 1.7-3.2 3M32 18.5c4.5-2.6 8-1.4 10.4 2.2M21 32.8c7.8-.8 16-3.5 21.2-.8"/>
  </g>
  <g class="tn-user-marker-face">
    <ellipse cx="26" cy="24" rx="1.8" ry="3.4"/>
    <ellipse cx="34.3" cy="23.4" rx="1.8" ry="3.4"/>
    <path d="M23 33.4c6.7-.8 13-3.1 18.2-1.4l-5.9 3.6z"/>
    <path d="M44.7 29.9 57.2 32.6 54.7 36.7 42.5 32.6z"/>
    <circle cx="58" cy="32.6" r="2.2"/>
  </g>
</svg>`;
}
