import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import RelatedPagesSection from "@/components/RelatedPagesSection";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { getSeoPageUiLabels, SeoLandingPageDefinition } from "@/data/seo-pages";
import { Shop } from "@/data/shops";

type SeoLandingPageProps = {
  page: SeoLandingPageDefinition;
  shops: Shop[];
};

export default function SeoLandingPage({ page, shops }: SeoLandingPageProps) {
  const pageId = slugifyId(page.h1);
  const labels = getSeoPageUiLabels(page.language);
  const listingLimit = page.listingLimit ?? 10;
  const visibleShops = shops.slice(0, listingLimit);
  const hasMoreListings = shops.length > visibleShops.length;
  const searchCopy = getSearchCopy(page);

  return (
    <section className="container-shell py-6 md:py-8" lang={labels.htmlLang}>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">{labels.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{page.introCopy}</p>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            {labels.adultNotice}
          </p>
          <div className="mt-6">
            <SearchBar
              compact
              helperText={searchCopy.helperText}
              placeholder={searchCopy.placeholder}
            />
            {page.intent === "near-me" ? (
              <p className="mt-3 text-sm leading-6 text-muted">{searchCopy.locationNote}</p>
            ) : null}
          </div>
        </div>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">{labels.practicalNoteHeading}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {labels.disclaimer}
            </p>
          </div>
        </aside>
      </div>

      <DisclaimerNotice className="mt-8" text={labels.disclaimer} />

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{labels.aboutHeading}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{page.context}</p>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted">
          {page.practicalPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby={`${pageId}-listings-heading`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id={`${pageId}-listings-heading`} className="text-2xl font-bold text-ink">
              {labels.listingsHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {labels.listingsIntro}
            </p>
          </div>
          <Link
            className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-teal"
            href="/search"
          >
            {page.ctaLabel}
          </Link>
        </div>

        <div className="mt-6 grid gap-5">
          {visibleShops.length > 0 ? (
            visibleShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">{labels.noListingsHeading}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{labels.noListingsText}</p>
            </div>
          )}
        </div>
        {hasMoreListings ? (
          <div className="mt-5 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            <p>
              {getListingCountCopy(page.language, visibleShops.length, shops.length)}
            </p>
            <Link className="mt-3 inline-flex font-bold text-teal hover:text-ink" href="/search">
              {page.ctaLabel}
            </Link>
          </div>
        ) : null}
      </section>

      {visibleShops.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${pageId}-map-heading`}>
          <div className="mb-4">
            <h2 id={`${pageId}-map-heading`} className="text-2xl font-bold text-ink">
              {labels.mapHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{labels.mapIntro}</p>
          </div>
          <LazyShopMap shops={visibleShops} />
        </section>
      ) : null}

      <RelatedPagesSection
        className="mt-8"
        intro={labels.relatedIntro}
        language={page.language}
        links={page.relatedLinks}
        title={labels.relatedHeading}
      />

      <FAQSection
        className="mt-8"
        id={`${pageId}-faq`}
        items={page.faqItems}
        intro={labels.faqIntro}
        title={labels.faqTitle}
      />
    </section>
  );
}

type SeoSearchCopy = {
  helperText: string;
  locationNote?: string;
  placeholder: string;
};

function getSearchCopy(page: SeoLandingPageDefinition): SeoSearchCopy {
  if (page.intent === "near-me" && page.language === "nl") {
    return {
      helperText: "Gebruik mijn locatie is optioneel. Je kunt ook zoeken op buurt, straat of postcode.",
      locationNote:
        "Als je locatie deelt, wordt deze alleen in je browser gebruikt om locaties op afstand te sorteren. Je kunt de site ook gebruiken zonder locatie te delen.",
      placeholder: "Zoek op buurt, straat, postcode of gebied"
    };
  }

  if (page.intent === "near-me") {
    return {
      helperText: "Use my location is optional. You can also search by neighborhood, street, or postal code.",
      locationNote:
        "If you share location access, it is used only in your browser to sort nearby listings. You can still search manually without sharing location.",
      placeholder: "Search by neighborhood, street, postal code, or area"
    };
  }

  if (page.language === "nl") {
    return {
      helperText: "Zoek op gebied, postcode, straat, station of buurt.",
      placeholder: "Zoek op gebied, postcode, straat of buurt"
    };
  }

  if (page.language === "de") {
    return {
      helperText: "Suchen Sie nach Gebiet, Postleitzahl, Straße, Bahnhof oder Stadtteil.",
      placeholder: "Gebiet, Postleitzahl, Straße oder Stadtteil"
    };
  }

  if (page.language === "fr") {
    return {
      helperText: "Recherchez par zone, code postal, rue, gare ou quartier.",
      placeholder: "Zone, code postal, rue ou quartier"
    };
  }

  return {
    helperText: "Search by area, postal code, street, station, or neighborhood.",
    placeholder: "Search by area, postal code, street, or neighborhood"
  };
}

function getListingCountCopy(language: SeoLandingPageDefinition["language"], visibleCount: number, totalCount: number) {
  if (language === "nl") {
    return `${visibleCount} van ${totalCount} gepubliceerde vermeldingen worden op deze pagina getoond.`;
  }

  if (language === "de") {
    return `${visibleCount} von ${totalCount} veröffentlichten Einträgen werden auf dieser Seite angezeigt.`;
  }

  if (language === "fr") {
    return `${visibleCount} sur ${totalCount} fiches publiées sont affichées sur cette page.`;
  }

  return `Showing ${visibleCount} of ${totalCount} published Amsterdam listings on this page.`;
}

function slugifyId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
