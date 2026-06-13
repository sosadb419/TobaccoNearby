import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accessibility, CalendarDays, ExternalLink, MapPin, Phone, Route, Train } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection, { type FAQItem } from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import ReportIncorrectInfo from "@/components/ReportIncorrectInfo";
import ShopComments from "@/components/ShopComments";
import { TrackedDirectionsLink, TrackedShopDetailsLink } from "@/components/TrackedLinks";
import { areaDefinitions, getAreaDefinition, type AreaDefinition } from "@/data/areas";
import {
  Shop,
  getDirectionsUrl,
  formatOpeningHours,
  getDistanceKm,
  getOpeningStatusLabel,
  getPlaceTypeLabel,
  getTodayOpeningHours,
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
      absolute: `${shop.name} ${shop.city || "Amsterdam"} | Map, Opening Hours & Directions`
    },
    description: `View practical location information for ${shop.name} in ${shop.city || "Amsterdam"}, including map directions, opening hours, contact details and nearby locations. Adults 18+ only.`,
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
  const neighborhoodHref = getShopAreaHref(shop);
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
  const placeTypeLabel = getPlaceTypeLabel(shop.place_type);
  const areaDefinition = getShopAreaDefinition(shop);
  const areaLabel = areaDefinition?.label ?? shop.neighborhood;
  const areaHref = areaDefinition?.href ?? neighborhoodHref;
  const fullAddress = getFullAddress(shop);
  const nearbyAreaLinks = getNearbyAreaLinks(shop);
  const shopFaqs = getShopFaqs(shop, directionsUrl);
  const listingUpdateLines = getListingUpdateLines(shop);

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
              {placeTypeLabel}
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

          <section className="mt-6 rounded-lg border border-line bg-paper p-5" aria-labelledby="about-location-heading">
            <h2 id="about-location-heading" className="text-xl font-bold text-ink">
              About this location
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {getAboutLocationText(shop, placeTypeLabel, areaLabel, fullAddress)}
            </p>
          </section>

          <section className="mt-8" aria-labelledby="location-information-heading">
            <h2 id="location-information-heading" className="text-2xl font-bold text-ink">
              Location information
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Practical listing details are shown below. Please verify opening hours, contact information and
              accessibility details before visiting.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
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
          </section>

          <DisclaimerNotice
            className="mt-6"
            text="Please verify opening hours, contact details, accessibility information and product availability before visiting."
          />

          <section className="mt-8 rounded-lg border border-line bg-white p-5" aria-labelledby="nearby-area-information-heading">
            <h2 id="nearby-area-information-heading" className="text-2xl font-bold text-ink">
              Nearby area information
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{getNearbyAreaInformation(shop, areaLabel)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
                href="/amsterdam/tobacco-shops"
              >
                Amsterdam listings
              </Link>
              {areaDefinition ? (
                <Link
                  className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
                  href={areaHref}
                >
                  {areaDefinition.label}
                </Link>
              ) : null}
              {nearbyAreaLinks.map((area) => (
                <Link
                  key={area.slug}
                  className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
                  href={area.href}
                >
                  {area.label}
                </Link>
              ))}
            </div>
          </section>

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

          <section className="mt-8 rounded-lg border border-line bg-paper p-5" aria-labelledby="listing-updates-heading">
            <h2 id="listing-updates-heading" className="text-xl font-bold text-ink">
              Listing updates
            </h2>
            <dl className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {listingUpdateLines.map((item) => (
                <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <dt className="font-semibold text-ink">{item.label}:</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
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
                href="/amsterdam/tobacco-shops"
              >
                Back to Amsterdam listings
              </Link>
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                href={areaHref}
              >
                View {areaLabel}
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
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
                href="/add-or-update-a-shop"
              >
                Add or update information
              </Link>
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
              href={areaHref}
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

      <FAQSection
        className="mt-8"
        id="shop-detail-faq"
        title={`${shop.name} FAQ`}
        intro="Short practical answers about this listed location. Shop details may change, so verify information before visiting."
        items={shopFaqs}
      />

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
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
        {icon}
        {title}
      </h3>
      <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
    </section>
  );
}

const nearbyAreaSlugMap: Record<string, string[]> = {
  centrum: ["central-station", "de-wallen", "jordaan", "de-pijp"],
  "central-station": ["centrum", "de-wallen", "jordaan", "west"],
  "de-wallen": ["centrum", "central-station", "jordaan", "oost"],
  jordaan: ["centrum", "west", "de-wallen", "central-station"],
  "de-pijp": ["zuid", "centrum", "oost", "west"],
  west: ["nieuw-west", "jordaan", "centrum", "zuid"],
  "nieuw-west": ["west", "zuid", "diemen", "centrum"],
  oost: ["centrum", "zuid", "diemen", "de-pijp"],
  noord: ["central-station", "centrum", "west", "oost"],
  zuid: ["de-pijp", "west", "oost", "zuidoost"],
  zuidoost: ["diemen", "oost", "zuid", "central-station"],
  diemen: ["oost", "zuidoost", "zuid", "centrum"]
};

function getAboutLocationText(shop: Shop, placeTypeLabel: string, areaLabel: string, fullAddress: string) {
  const typeDescription = placeTypeLabel.toLowerCase();
  const article = /^[aeiou]/i.test(typeDescription) ? "an" : "a";
  const neighborhoodText =
    shop.neighborhood && normalize(shop.neighborhood) !== normalize(areaLabel)
      ? ` within the ${shop.neighborhood} area`
      : "";
  const addressText = fullAddress ? ` The address shown for this listing is ${fullAddress}.` : "";

  return `${shop.name} is listed as ${article} ${typeDescription} in ${areaLabel}${neighborhoodText}.${addressText} This page brings together opening hours, contact details, directions, map information and nearby listings so adults aged 18+ can verify practical details before visiting.`;
}

function getNearbyAreaInformation(shop: Shop, areaLabel: string) {
  const neighborhoodText = shop.neighborhood
    ? `${shop.neighborhood} is the local neighborhood shown for this listing.`
    : `${areaLabel} is the area shown for this listing.`;
  const transportText = shop.nearbyPublicTransport
    ? ` Nearby public transport information currently listed: ${shop.nearbyPublicTransport}`
    : " Nearby public transport details are not currently listed for this location.";

  return `${neighborhoodText}${transportText} Use the area links below to compare other listed locations around ${areaLabel} and Amsterdam.`;
}

function getShopFaqs(shop: Shop, directionsUrl: string | null): FAQItem[] {
  const todayHours = getTodayOpeningHours(shop);
  const openingStatus = getOpeningStatusLabel(shop);
  const hasOpeningHours = todayHours !== "Opening hours not available";

  return [
    {
      question: `What are the opening hours for ${shop.name}?`,
      answer: hasOpeningHours
        ? `Today's listed hours are ${todayHours}. Full opening-hours information is shown on this page, but times may change and should be verified before visiting.`
        : "Opening hours are not currently available for this listing. Please verify details directly before visiting."
    },
    {
      question: `Is ${shop.name} currently open?`,
      answer:
        openingStatus === "Opening hours not available"
          ? "Current open status cannot be determined because opening-hours data is missing or unclear."
          : `Available opening-hours data currently shows this location as ${openingStatus.toLowerCase()}. Please verify before travelling.`
    },
    {
      question: `How can I get to ${shop.name}?`,
      answer: directionsUrl
        ? "Use the directions link on this page to open address-based directions in Google Maps."
        : "Directions are not currently available for this listing because address or map details are missing."
    },
    {
      question: "Is parking available nearby?",
      answer:
        "Parking information is not currently listed on TobaccoNearby. Check local parking rules or a navigation app before travelling."
    },
    {
      question: `Does ${shop.name} have a website?`,
      answer: shop.website
        ? "A website link is listed on this page where available. Please verify details directly with the location before visiting."
        : "No public website is currently listed for this location."
    }
  ];
}

function getFullAddress(shop: Shop) {
  return [shop.address, [shop.postalCode, shop.city].filter(Boolean).join(" "), shop.country]
    .filter(Boolean)
    .join(", ");
}

function getListingUpdateLines(shop: Shop) {
  const lines: Array<{ label: string; value: string }> = [];

  if (shop.lastUpdated) {
    lines.push({ label: "Last updated", value: shop.lastUpdated });
  }

  if (shop.last_checked_at) {
    lines.push({ label: "Last checked", value: shop.last_checked_at });
  }

  if (shop.verified) {
    lines.push({ label: "Verification", value: "Marked as a verified listing." });
  }

  return lines.length > 0 ? lines : [{ label: "Listing status", value: "Update dates are not available." }];
}

function getNearbyAreaLinks(shop: Shop) {
  const currentAreaSlug = getComparableAreaSlug(shop);
  const nearbySlugs = nearbyAreaSlugMap[currentAreaSlug] ?? ["centrum", "de-pijp", "jordaan", "oost"];

  return nearbySlugs
    .map((areaSlug) => getAreaDefinition(areaSlug))
    .filter((area): area is AreaDefinition => Boolean(area))
    .filter((area) => area.slug !== currentAreaSlug)
    .slice(0, 4);
}

function getNearbyListedShops(currentShop: Shop, shopList: Shop[]) {
  return shopList
    .filter((shop) => shop.slug !== currentShop.slug && isPublishedShop(shop))
    .map((shop) => ({
      shop,
      sameArea: getComparableAreaSlug(shop) === getComparableAreaSlug(currentShop),
      sameNeighborhood: normalize(shop.neighborhood) === normalize(currentShop.neighborhood),
      distance: getSafeDistanceKm(currentShop, shop)
    }))
    .sort((a, b) => {
      if (a.sameArea !== b.sameArea) {
        return a.sameArea ? -1 : 1;
      }

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

function getShopAreaHref(shop: Shop) {
  return getShopAreaDefinition(shop)?.href ?? `/search?neighborhood=${encodeURIComponent(shop.neighborhood)}`;
}

function getComparableAreaSlug(shop: Shop) {
  return getShopAreaDefinition(shop)?.slug ?? normalize(shop.area_slug || shop.neighborhood);
}

function getShopAreaDefinition(shop: Shop) {
  if (shop.area_slug) {
    const area = getAreaDefinition(shop.area_slug);

    if (area) {
      return area;
    }
  }

  const normalizedNeighborhood = normalize(shop.neighborhood);
  return areaDefinitions.find(
    (item) =>
      normalize(item.label) === normalizedNeighborhood ||
      normalize(item.searchLabel) === normalizedNeighborhood ||
      item.fallbackTerms.some((term) => normalize(term) === normalizedNeighborhood)
  );
}

function isPublishedShop(shop: Shop) {
  return !shop.status || shop.status === "published";
}
