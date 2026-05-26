import { Accessibility, ExternalLink, MapPin, Phone, Route, ShieldCheck } from "lucide-react";
import { TrackedDirectionsLink, TrackedShopDetailsLink } from "@/components/TrackedLinks";
import {
  amsterdamCentralStation,
  Coordinates,
  formatDistance,
  formatOpeningHours,
  getDirectionsUrl,
  getDistanceKm,
  getPlaceTypeLabel,
  getTodayOpeningHours,
  isOpenNow,
  Shop
} from "@/data/shops";

type ShopCardProps = {
  shop: Shop;
  origin?: Coordinates;
  showLiveStatus?: boolean;
  priorityLabel?: string;
};

export default function ShopCard({ shop, origin, showLiveStatus = false, priorityLabel }: ShopCardProps) {
  const distanceOrigin = origin ?? amsterdamCentralStation;
  const distance = formatDistance(getDistanceKm(shop, distanceOrigin));
  const distanceContext = origin ? "from your location" : "from Amsterdam Central";
  const accessible =
    shop.wheelchairAccessible === undefined ? "Unknown" : shop.wheelchairAccessible ? "Yes" : "No";
  const openNow = showLiveStatus ? isOpenNow(shop) : null;
  const directionsUrl = getDirectionsUrl(shop);

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {priorityLabel ? (
            <p className="mb-2 text-xs font-bold uppercase text-teal">{priorityLabel}</p>
          ) : null}
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="inline-flex rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-muted">
              {getPlaceTypeLabel(shop.place_type)}
            </span>
            {shop.verified ? (
              <span className="inline-flex rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-teal">
                Verified listing
              </span>
            ) : null}
          </div>
          <h2 className="text-xl font-bold text-ink">
            <TrackedShopDetailsLink
              className="focus-ring rounded-md hover:text-teal"
              href={`/shops/${shop.slug}`}
              shopSlug={shop.slug}
              neighborhood={shop.neighborhood}
            >
              {shop.name}
            </TrackedShopDetailsLink>
          </h2>
          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted">
            <MapPin aria-hidden="true" className="mt-1 shrink-0" size={16} />
            <span>
              {shop.address}, {shop.postalCode} {shop.city}
            </span>
          </p>
        </div>
        <div className="rounded-lg bg-paper px-3 py-2 text-sm font-semibold text-ink">
          {distance} <span className="font-normal text-muted">{distanceContext}</span>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">{showLiveStatus ? "Current status" : "Opening hours"}</dt>
          <dd className="mt-1 text-muted">
            {showLiveStatus ? (
              <>
                <span className={openNow ? "font-semibold text-moss" : "font-semibold text-amber"}>
                  {openNow ? "Open now" : "Not marked open now"}
                </span>
                <span className="block">Today: {getTodayOpeningHours(shop)}</span>
              </>
            ) : (
              formatOpeningHours(shop.openingHours).slice(0, 2).join("; ")
            )}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Neighborhood</dt>
          <dd className="mt-1 text-muted">{shop.neighborhood}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Phone</dt>
          <dd className="mt-1 text-muted">{shop.phone ?? "Not available"}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 font-semibold text-ink">
            <Accessibility aria-hidden="true" size={16} />
            Wheelchair accessible
          </dt>
          <dd className="mt-1 text-muted">{accessible}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <TrackedShopDetailsLink
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-teal"
          href={`/shops/${shop.slug}`}
          shopSlug={shop.slug}
          neighborhood={shop.neighborhood}
        >
          <ShieldCheck aria-hidden="true" size={16} />
          View details
        </TrackedShopDetailsLink>
        {directionsUrl ? (
          <TrackedDirectionsLink
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
            href={directionsUrl}
            shopSlug={shop.slug}
            neighborhood={shop.neighborhood}
            target="_blank"
            rel="noreferrer"
          >
            <Route aria-hidden="true" size={16} />
            Directions
          </TrackedDirectionsLink>
        ) : null}
        {shop.website ? (
          <a
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
            href={shop.website}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden="true" size={16} />
            Website
          </a>
        ) : null}
        {shop.phone ? (
          <a
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
            href={`tel:${shop.phone.replace(/\s/g, "")}`}
          >
            <Phone aria-hidden="true" size={16} />
            Call
          </a>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-4 text-xs text-muted">
        <p>Last updated: {shop.lastUpdated}</p>
        {shop.last_checked_at ? <p>Last checked: {shop.last_checked_at}</p> : null}
      </div>
    </article>
  );
}
