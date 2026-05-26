import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accessibility, CalendarDays, ExternalLink, MapPin, Phone, Route, Train } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import LazyShopMap from "@/components/LazyShopMap";
import ReportIncorrectInfo from "@/components/ReportIncorrectInfo";
import ShopComments from "@/components/ShopComments";
import { TrackedDirectionsLink, TrackedShopDetailsLink } from "@/components/TrackedLinks";
import {
  Shop,
  getDirectionsUrl,
  formatOpeningHours,
  getDistanceKm,
  getPlaceTypeLabel,
  normalize
} from "@/data/shops";
import { getAllShops, getShopBySlug } from "@/lib/shop-data";
import { getApprovedCommentsForShop } from "@/lib/shop-comments";
import { generateLocalBusinessJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type ShopDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ShopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);

  if (!shop) {
    return {
      title: "Shop Not Found"
    };
  }

  return {
    title: {
      absolute: `${shop.name} Amsterdam | Address, Opening Hours & Directions`
    },
    description: `View practical information for ${shop.name} in Amsterdam, including address, opening hours, directions, contact details and neighborhood information. Adults 18+ only.`,
    alternates: {
      canonical: `/shops/${shop.slug}`
    }
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);

  if (!shop) {
    notFound();
  }

  const shopList = await getAllShops();
  const approvedComments = await getApprovedCommentsForShop(shop.slug);
  const nearbyShops = getNearbyListedShops(shop, shopList);
  const neighborhoodHref = getNeighborhoodHref(shop.neighborhood);
  const accessibility =
    shop.wheelchairAccessible === undefined
      ? "Accessibility information not available."
      : shop.wheelchairAccessible
        ? "Yes"
        : "No";
  const openingHours = formatOpeningHours(shop.openingHours);
  const hasMapLocation = hasValidCoordinates(shop);
  const directionsUrl = getDirectionsUrl(shop);
  const schema = generateLocalBusinessJsonLd(shop);

  return (
    <section className="container-shell py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link className="focus-ring rounded-md hover:text-teal" href="/search">
          Search
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{shop.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Amsterdam shop detail</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{shop.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-muted">
              {getPlaceTypeLabel(shop.place_type)}
            </span>
            {shop.verified ? (
              <span className="inline-flex rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-teal">
                Verified listing
              </span>
            ) : null}
            {shop.last_checked_at ? (
              <span className="text-sm text-muted">Last checked: {shop.last_checked_at}</span>
            ) : null}
          </div>
          <p className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            This page provides neutral, practical information about this listed location in Amsterdam, including
            address details, opening hours where available, contact links, directions and nearby public transport notes.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <InfoBlock icon={<MapPin aria-hidden="true" size={18} />} title="Address">
              {shop.address}
              <br />
              {shop.postalCode} {shop.city}
              <br />
              {shop.country}
            </InfoBlock>
            <InfoBlock icon={<MapPin aria-hidden="true" size={18} />} title="Neighborhood">
              <Link className="font-semibold text-teal hover:text-ink" href={neighborhoodHref}>
                {shop.neighborhood}
              </Link>
            </InfoBlock>
            <InfoBlock icon={<CalendarDays aria-hidden="true" size={18} />} title="Opening hours">
              <ul className="grid gap-1">
                {openingHours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </InfoBlock>
            <InfoBlock icon={<Phone aria-hidden="true" size={18} />} title="Contact information">
              {shop.phone ? <p>Phone: {shop.phone}</p> : null}
              {shop.website ? (
                <a className="font-semibold text-teal hover:text-ink" href={shop.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
              {!shop.phone && !shop.website ? <p>Contact details not available.</p> : null}
            </InfoBlock>
            <InfoBlock icon={<Accessibility aria-hidden="true" size={18} />} title="Accessibility">
              Wheelchair accessible: {accessibility}
            </InfoBlock>
            {shop.nearbyPublicTransport ? (
              <InfoBlock icon={<Train aria-hidden="true" size={18} />} title="Nearby public transport">
                {shop.nearbyPublicTransport}
              </InfoBlock>
            ) : null}
            {directionsUrl ? (
              <InfoBlock icon={<Route aria-hidden="true" size={18} />} title="Directions">
                <TrackedDirectionsLink
                  className="font-semibold text-teal hover:text-ink"
                  href={directionsUrl}
                  shopSlug={shop.slug}
                  neighborhood={shop.neighborhood}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open directions on Google Maps
                </TrackedDirectionsLink>
              </InfoBlock>
            ) : null}
          </div>

          <DisclaimerNotice
            className="mt-6"
            text="Please verify opening hours, contact details, accessibility information and product availability before visiting."
          />

          <section className="mt-8" aria-labelledby="shop-map-heading">
            <h2 id="shop-map-heading" className="text-2xl font-bold text-ink">
              Map location
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Map markers are approximate and are provided for practical location reference only.
            </p>
            <div className="mt-4">
              {hasMapLocation ? (
                <LazyShopMap shops={[shop]} />
              ) : (
                <div className="rounded-lg border border-line bg-paper p-5 text-sm leading-6 text-muted">
                  Map location is not available for this listing.
                </div>
              )}
            </div>
          </section>

          {shop.lastUpdated ? <p className="mt-5 text-sm text-muted">Last updated: {shop.lastUpdated}</p> : null}
        </article>

        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Shop actions</h2>
            <div className="mt-4 grid gap-3">
              {directionsUrl ? (
                <TrackedDirectionsLink
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
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
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                href="/search"
              >
                Back to search
              </Link>
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                href={neighborhoodHref}
              >
                View {shop.neighborhood}
              </Link>
              {shop.website ? (
                <a
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                  href={shop.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink aria-hidden="true" size={16} />
                  Website
                </a>
              ) : null}
              <ReportIncorrectInfo shopName={shop.name} shopSlug={shop.slug} neighborhood={shop.neighborhood} />
            </div>
          </div>
        </aside>
      </div>

      <ShopComments
        approvedComments={approvedComments}
        shopId={shop.id}
        shopName={shop.name}
        shopSlug={shop.slug}
      />

      {nearbyShops.length > 0 ? (
        <section className="mt-8" aria-labelledby="nearby-shops-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="nearby-shops-heading" className="text-2xl font-bold text-ink">
                Nearby listed shops
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Nearby listings are shown for practical navigation. Please verify details before visiting.
              </p>
            </div>
            <Link
              className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              href={neighborhoodHref}
            >
              View area page
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nearbyShops.map((nearbyShop) => (
              <NearbyShopCard key={nearbyShop.slug} shop={nearbyShop} />
            ))}
          </div>
        </section>
      ) : null}

      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
    </section>
  );
}

function NearbyShopCard({ shop }: { shop: Shop }) {
  const directionsUrl = getDirectionsUrl(shop);

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-muted">{shop.neighborhood}</p>
      <h3 className="mt-2 text-lg font-bold text-ink">
        <TrackedShopDetailsLink
          className="focus-ring rounded-md hover:text-teal"
          href={`/shops/${shop.slug}`}
          shopSlug={shop.slug}
          neighborhood={shop.neighborhood}
        >
          {shop.name}
        </TrackedShopDetailsLink>
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">{shop.address}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <TrackedShopDetailsLink
          className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
          href={`/shops/${shop.slug}`}
          shopSlug={shop.slug}
          neighborhood={shop.neighborhood}
        >
          View details
        </TrackedShopDetailsLink>
        {directionsUrl ? (
          <TrackedDirectionsLink
            className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
            href={directionsUrl}
            shopSlug={shop.slug}
            neighborhood={shop.neighborhood}
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </TrackedDirectionsLink>
        ) : null}
      </div>
    </article>
  );
}

function InfoBlock({
  icon,
  title,
  children
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
        {icon}
        {title}
      </h2>
      <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
    </section>
  );
}

function getNearbyListedShops(currentShop: Shop, shopList: Shop[]) {
  return shopList
    .filter((shop) => shop.slug !== currentShop.slug)
    .map((shop) => ({
      shop,
      sameNeighborhood: normalize(shop.neighborhood) === normalize(currentShop.neighborhood),
      distance: getSafeDistanceKm(currentShop, shop)
    }))
    .sort((a, b) => {
      if (a.sameNeighborhood !== b.sameNeighborhood) {
        return a.sameNeighborhood ? -1 : 1;
      }

      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      return a.shop.name.localeCompare(b.shop.name);
    })
    .slice(0, 5)
    .map(({ shop }) => shop);
}

function getSafeDistanceKm(origin: Shop, shop: Shop) {
  if (!hasValidCoordinates(origin) || !hasValidCoordinates(shop)) {
    return Number.POSITIVE_INFINITY;
  }

  return getDistanceKm(shop, { latitude: origin.latitude, longitude: origin.longitude });
}

function hasValidCoordinates(shop: Shop) {
  return Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude);
}

function getNeighborhoodHref(neighborhood: string) {
  const slug = normalize(neighborhood);
  const knownAreaSlugs = new Set(["centrum", "de-pijp", "jordaan", "de-wallen", "west", "oost", "noord", "zuid", "zuidoost"]);

  if (knownAreaSlugs.has(slug)) {
    return `/amsterdam/${slug}`;
  }

  return `/search?neighborhood=${encodeURIComponent(neighborhood)}`;
}
