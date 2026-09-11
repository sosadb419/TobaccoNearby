import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import type { Shop } from "@/data/shops";
import {
  utrechtCityPage,
  utrechtDutchPages,
  type UtrechtAreaDefinition,
  type UtrechtAreaSlug,
  type UtrechtPageContent
} from "@/data/utrecht-seo";

type EligibleUtrechtArea = {
  area: UtrechtAreaDefinition;
  shops: Shop[];
};

type UtrechtLandingPageProps = {
  config: UtrechtPageContent;
  shops: Shop[];
  eligibleAreas: EligibleUtrechtArea[];
  currentAreaSlug?: UtrechtAreaSlug;
};

const siteUrl = "https://tobacconearby.com";

export default function UtrechtLandingPage({
  config,
  shops,
  eligibleAreas,
  currentAreaSlug
}: UtrechtLandingPageProps) {
  const isDutch = config.language === "nl";
  const visibleShops = config.listingLimit ? shops.slice(0, config.listingLimit) : shops;
  const orderedAreas = getOrderedAreas(eligibleAreas, currentAreaSlug);
  const searchHref = getSearchHref(config, currentAreaSlug);
  const breadcrumbs = getBreadcrumbs(config);
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);
  const collectionSchema = createCollectionSchema(config, visibleShops);

  return (
    <section className="container-shell py-6 md:py-8" lang={config.language}>
      <nav aria-label={isDutch ? "Broodkruimelpad" : "Breadcrumb"} className="mb-5">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight aria-hidden="true" size={14} /> : null}
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link className="focus-ring rounded-md hover:text-teal" href={crumb.href}>
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">{config.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{config.h1}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{config.intro}</p>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            {isDutch
              ? "TobaccoNearby verkoopt geen tabaksproducten en is bedoeld voor volwassenen van 18+."
              : "TobaccoNearby does not sell tobacco products and is intended for adults aged 18+."}
          </p>
          <div className="mt-5">
            <SearchBar
              citySlug="utrecht"
              compact
              helperText={
                isDutch
                  ? "Zoek op Utrechtse wijk, straat of postcode. Locatietoegang is optioneel."
                  : "Search by Utrecht area, street or postal code. Location access is optional."
              }
              locationDeniedText={
                isDutch
                  ? "Locatietoegang is niet toegestaan. Je kunt nog steeds zoeken op wijk, straat of postcode."
                  : undefined
              }
              locationFailedText={
                isDutch ? "Je locatie kon niet worden bepaald. Je kunt nog steeds handmatig zoeken." : undefined
              }
              locationLabel={isDutch ? "Gebruik mijn locatie" : undefined}
              locationRequestText={isDutch ? "Je locatie wordt opgevraagd..." : undefined}
              placeholder={isDutch ? "Zoek op wijk, straat of postcode in Utrecht" : "Search Utrecht by area, street or postal code"}
              submitLabel={isDutch ? "Zoeken" : "Search"}
            />
          </div>
        </div>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <MapPin aria-hidden="true" size={18} />
            {isDutch ? "Lokale afstandsreferentie" : "Local distance reference"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {isDutch
              ? "Zonder gedeelde browserlocatie gebruikt Utrecht Utrecht Centraal als referentiepunt. Je coördinaten worden niet opgeslagen."
              : "Without a shared browser location, Utrecht listings use Utrecht Centraal as their reference point. Coordinates are not stored."}
          </p>
          <Link className="mt-4 inline-flex text-sm font-bold text-teal hover:text-ink" href={searchHref}>
            {isDutch ? "Bekijk in de zoekpagina" : "Open Utrecht search"}
          </Link>
        </aside>
      </div>

      <DisclaimerNotice
        className="mt-6"
        text={
          isDutch
            ? "Locatiegegevens kunnen wijzigen. Controleer openingstijden, contactgegevens, toegankelijkheid en actuele beschikbaarheid voor vertrek."
            : undefined
        }
      />

      {orderedAreas.length > 0 ? (
        <section className="mt-8" aria-labelledby="utrecht-areas-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="utrecht-areas-heading" className="text-2xl font-bold text-ink">
                {isDutch ? "Gebieden in Utrecht" : "Areas in Utrecht"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {isDutch
                  ? "Alleen gebieden met voldoende gepubliceerde locatiedata hebben een eigen pagina."
                  : "Only areas with enough published location data have their own page."}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {orderedAreas.map(({ area, shops: areaShops }) => (
              <TrackedNeighborhoodLink
                key={area.slug}
                className={`focus-ring rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  area.slug === currentAreaSlug
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-white text-ink hover:border-teal hover:text-teal"
                }`}
                href={area.href}
                neighborhood={area.label}
              >
                <span className="block">{area.label}</span>
                <span className={`text-xs font-normal ${area.slug === currentAreaSlug ? "text-white" : "text-muted"}`}>
                  {areaShops.length} {isDutch ? "locaties" : "locations"}
                </span>
              </TrackedNeighborhoodLink>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-5" aria-labelledby="utrecht-context-heading">
          <h2 id="utrecht-context-heading" className="text-xl font-bold text-ink">
            {config.contextHeading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{config.areaContext}</p>
        </section>
        <section className="rounded-lg border border-line bg-white p-5" aria-labelledby="utrecht-practical-heading">
          <h2 id="utrecht-practical-heading" className="text-xl font-bold text-ink">
            {isDutch ? "Praktische informatie" : "Practical information"}
          </h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
            {config.practicalInfo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      {shops.length > 0 ? (
        <section className="mt-8" aria-labelledby="utrecht-map-heading">
          <h2 id="utrecht-map-heading" className="text-2xl font-bold text-ink">
            {isDutch ? "Kaart van vermelde locaties" : "Map of listed locations"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {isDutch
              ? "De kaart gebruikt dezelfde Utrecht-filter als de lijst. Kaartpunten zijn bedoeld als praktische oriëntatie."
              : "The map uses the same Utrecht scope as the list. Markers are provided for practical orientation."}
          </p>
          <div className="mt-4">
            <LazyShopMap defaultCitySlug="utrecht" shops={shops} />
          </div>
        </section>
      ) : null}

      <section className="mt-8" aria-labelledby="utrecht-listings-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="utrecht-listings-heading" className="text-2xl font-bold text-ink">
              {config.listingHeading}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{config.listingIntro}</p>
          </div>
          <Link
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
            href={searchHref}
          >
            {isDutch ? "Bekijk alle locaties" : "View all locations"}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <p className="mt-4 text-sm font-semibold text-muted">
          {shops.length} {isDutch ? "gepubliceerde locaties" : "published locations"}
        </p>
        <div className="mt-5 grid gap-5">
          {visibleShops.length > 0 ? (
            visibleShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6 text-sm leading-6 text-muted">
              {isDutch
                ? "Er zijn momenteel geen gepubliceerde locaties voor deze pagina."
                : "No published locations are currently available for this page."}
            </div>
          )}
        </div>
        {shops.length > visibleShops.length ? (
          <p className="mt-5 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-muted">
            {isDutch
              ? `Deze pagina toont ${visibleShops.length} van ${shops.length} gepubliceerde locaties.`
              : `This page shows ${visibleShops.length} of ${shops.length} published locations.`}{" "}
            <Link className="font-bold text-teal hover:text-ink" href={searchHref}>
              {isDutch ? "Bekijk de volledige lijst." : "View the full list."}
            </Link>
          </p>
        ) : null}
      </section>

      <section className="mt-8 border-t border-line pt-6" aria-labelledby="utrecht-related-heading">
        <h2 id="utrecht-related-heading" className="text-lg font-bold text-ink">
          {isDutch ? "Andere Utrecht-pagina's" : "Other Utrecht pages"}
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[utrechtCityPage, utrechtDutchPages.tabakswinkel, utrechtDutchPages.sigaretten]
            .filter((page) => page.href !== config.href)
            .map((page) => (
              <Link
                key={page.href}
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
                href={page.href}
              >
                {page.breadcrumbLabel}
              </Link>
            ))}
        </div>
      </section>

      <FAQSection
        className="mt-8"
        id={`utrecht-${currentAreaSlug ?? config.language}-faq`}
        title={config.faqTitle}
        intro={config.faqIntro}
        items={config.faqs}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(collectionSchema) }}
      />
    </section>
  );
}

function getOrderedAreas(eligibleAreas: EligibleUtrechtArea[], currentAreaSlug?: UtrechtAreaSlug) {
  if (!currentAreaSlug) {
    return eligibleAreas;
  }

  const current = eligibleAreas.find(({ area }) => area.slug === currentAreaSlug);
  const relatedSlugs = current?.area.relatedAreaSlugs ?? [];

  return [...eligibleAreas].sort((a, b) => {
    if (a.area.slug === currentAreaSlug) return -1;
    if (b.area.slug === currentAreaSlug) return 1;

    const aIndex = relatedSlugs.indexOf(a.area.slug);
    const bIndex = relatedSlugs.indexOf(b.area.slug);

    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }

    return a.area.label.localeCompare(b.area.label);
  });
}

function getSearchHref(config: UtrechtPageContent, currentAreaSlug?: UtrechtAreaSlug) {
  const params = new URLSearchParams({ city: "utrecht" });

  if (currentAreaSlug) {
    const label = config.breadcrumbLabel;
    params.set("q", label);
    params.set("neighborhood", label);
  }

  return `/search?${params.toString()}`;
}

function getBreadcrumbs(config: UtrechtPageContent) {
  const breadcrumbs = [{ label: "Home", href: "/" }];

  if (config.href !== "/utrecht") {
    breadcrumbs.push({ label: "Utrecht", href: "/utrecht" });
  }

  breadcrumbs.push({ label: config.breadcrumbLabel, href: config.href });
  return breadcrumbs;
}

function createBreadcrumbSchema(breadcrumbs: Array<{ label: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`
    }))
  };
}

function createCollectionSchema(config: UtrechtPageContent, shops: Shop[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.h1,
    description: config.description,
    url: `${siteUrl}${config.href}`,
    isPartOf: {
      "@type": "WebSite",
      name: "TobaccoNearby",
      url: siteUrl
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: shops.length,
      itemListElement: shops.map((shop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: shop.name,
        url: `${siteUrl}/shops/${shop.slug}`
      }))
    }
  };
}

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
