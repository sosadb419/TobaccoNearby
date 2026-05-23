import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accessibility, CalendarDays, ExternalLink, MapPin, Phone, Route, Train } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import ReportIncorrectInfo from "@/components/ReportIncorrectInfo";
import { TrackedDirectionsLink } from "@/components/TrackedLinks";
import { formatOpeningHours, getOpeningHoursSpecification } from "@/data/shops";
import { getShopBySlug } from "@/lib/shop-data";

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
    title: `${shop.name} Amsterdam | Address, Hours & Directions`,
    description: `View practical information for ${shop.name} in Amsterdam, including address, opening hours, directions, contact details, and last updated date.`,
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

  const accessibility =
    shop.wheelchairAccessible === undefined ? "Unknown" : shop.wheelchairAccessible ? "Yes" : "No";
  const mapSrc = `https://maps.google.com/maps?q=${shop.latitude},${shop.longitude}&z=15&output=embed`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      postalCode: shop.postalCode,
      addressLocality: shop.city,
      addressCountry: "NL"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.latitude,
      longitude: shop.longitude
    },
    telephone: shop.phone,
    url: shop.website,
    hasMap: shop.googleMapsLink,
    openingHoursSpecification: getOpeningHoursSpecification(shop)
  };

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
          {shop.verified || shop.last_checked_at ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {shop.verified ? (
                <span className="inline-flex rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-teal">
                  Verified listing
                </span>
              ) : null}
              {shop.last_checked_at ? (
                <span className="text-sm text-muted">Last checked: {shop.last_checked_at}</span>
              ) : null}
            </div>
          ) : null}
          <p className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <InfoBlock icon={<MapPin aria-hidden="true" size={18} />} title="Address">
              {shop.address}
              <br />
              {shop.postalCode} {shop.city}
              <br />
              {shop.country}
            </InfoBlock>
            <InfoBlock icon={<CalendarDays aria-hidden="true" size={18} />} title="Opening hours">
              <ul className="grid gap-1">
                {formatOpeningHours(shop.openingHours).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </InfoBlock>
            <InfoBlock icon={<Phone aria-hidden="true" size={18} />} title="Contact information">
              <span>Phone: {shop.phone ?? "Not available"}</span>
              <br />
              {shop.website ? (
                <a className="font-semibold text-teal hover:text-ink" href={shop.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : (
                <span>Website: Not available</span>
              )}
            </InfoBlock>
            <InfoBlock icon={<Accessibility aria-hidden="true" size={18} />} title="Accessibility">
              Wheelchair accessible: {accessibility}
            </InfoBlock>
            <InfoBlock icon={<Train aria-hidden="true" size={18} />} title="Nearby public transport">
              {shop.nearbyPublicTransport ?? "Not available"}
            </InfoBlock>
            <InfoBlock icon={<Route aria-hidden="true" size={18} />} title="Directions">
              <TrackedDirectionsLink
                className="font-semibold text-teal hover:text-ink"
                href={shop.googleMapsLink}
                shopSlug={shop.slug}
                neighborhood={shop.neighborhood}
                target="_blank"
                rel="noreferrer"
              >
                Open directions on Google Maps
              </TrackedDirectionsLink>
            </InfoBlock>
          </div>

          <DisclaimerNotice className="mt-6" />

          <div className="mt-8 overflow-hidden rounded-lg border border-line bg-paper">
            <iframe
              className="h-[320px] w-full border-0"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map location for ${shop.name}`}
            />
          </div>

          <p className="mt-5 text-sm text-muted">Last updated: {shop.lastUpdated}</p>
        </article>

        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Shop actions</h2>
            <div className="mt-4 grid gap-3">
              <TrackedDirectionsLink
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
                href={shop.googleMapsLink}
                shopSlug={shop.slug}
                neighborhood={shop.neighborhood}
                target="_blank"
                rel="noreferrer"
              >
                <Route aria-hidden="true" size={16} />
                Directions
              </TrackedDirectionsLink>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
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
