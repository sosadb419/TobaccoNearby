import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection, { type FAQItem } from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import type { CityDefinition } from "@/data/cities";
import type { Shop } from "@/data/shops";
import { normalizeAreaText } from "@/lib/shop-data";

type CityLandingPageProps = {
  city: CityDefinition;
  intro: string;
  practicalInfo: string[];
  shops: Shop[];
  title: string;
};

const listingLimit = 20;

export default function CityLandingPage({ city, intro, practicalInfo, shops, title }: CityLandingPageProps) {
  const visibleShops = shops.slice(0, listingLimit);
  const usefulAreas = getUsefulCityAreas(shops);
  const allCityListingsHref = `/search?city=${city.slug}`;
  const cityFaqs = getCityFaqs(city.name);

  return (
    <section className="container-shell py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">Supported city</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{intro}</p>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>
          <div className="mt-6">
            <SearchBar
              citySlug={city.slug}
              compact
              helperText={`Search by area, postal code, street or neighborhood in ${city.name}. Location access is optional.`}
              placeholder={`Search ${city.name} by area, postal code or neighborhood`}
            />
          </div>
        </div>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <MapPin aria-hidden="true" size={18} />
            {city.name} reference point
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            When browser location is not shared, distance context for {city.name} listings uses {city.referenceLabel} as
            the local reference point.
          </p>
          <Link className="mt-4 inline-flex text-sm font-bold text-teal hover:text-ink" href={allCityListingsHref}>
            View all {city.name} listings
          </Link>
        </aside>
      </div>

      <DisclaimerNotice className="mt-8" />

      {usefulAreas.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${city.slug}-areas-heading`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id={`${city.slug}-areas-heading`} className="text-2xl font-bold text-ink">
                Useful {city.name} areas
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                These area links are based on published listing data currently available for {city.name}.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {usefulAreas.map((area) => (
              <TrackedNeighborhoodLink
                key={area}
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:border-teal hover:text-teal"
                href={`/search?city=${city.slug}&neighborhood=${encodeURIComponent(area)}&q=${encodeURIComponent(area)}`}
                neighborhood={area}
              >
                {area}
              </TrackedNeighborhoodLink>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Practical information</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
          {practicalInfo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby={`${city.slug}-listings-heading`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id={`${city.slug}-listings-heading`} className="text-2xl font-bold text-ink">
              Published {city.name} listings
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Listings show practical details such as address, opening hours, directions and contact information where
              available.
            </p>
          </div>
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
            href={allCityListingsHref}
          >
            View all {city.name} listings
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-5">
          {visibleShops.length > 0 ? (
            visibleShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">No published listings available</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Published {city.name} listings will appear here when records are available.
              </p>
            </div>
          )}
        </div>

        {shops.length > visibleShops.length ? (
          <div className="mt-5 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Showing {visibleShops.length} of {shops.length} published {city.name} listings on this page.
            <Link className="ml-2 font-bold text-teal hover:text-ink" href={allCityListingsHref}>
              View all listings in search.
            </Link>
          </div>
        ) : null}
      </section>

      {visibleShops.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${city.slug}-map-heading`}>
          <h2 id={`${city.slug}-map-heading`} className="text-2xl font-bold text-ink">
            Map of listed locations
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Map markers are approximate and are provided for practical location reference only.
          </p>
          <div className="mt-4">
            <LazyShopMap defaultCitySlug={city.slug} shops={visibleShops} />
          </div>
        </section>
      ) : null}

      <FAQSection
        className="mt-8"
        id={`${city.slug}-faq`}
        items={cityFaqs}
        intro="Short practical answers about using TobaccoNearby city listings."
      />
    </section>
  );
}

function getUsefulCityAreas(shops: Shop[]) {
  const counts = new Map<string, { label: string; count: number }>();

  shops.forEach((shop) => {
    const label = shop.neighborhood?.trim();

    if (!label) {
      return;
    }

    const key = normalizeAreaText(label);
    const current = counts.get(key);

    counts.set(key, { label, count: (current?.count ?? 0) + 1 });
  });

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 12)
    .map((item) => item.label);
}

function getCityFaqs(cityName: string): FAQItem[] {
  return [
    {
      question: `How can I search tobacco shop listings in ${cityName}?`,
      answer:
        "Use the search bar to search by area, postal code, street or neighborhood. You can also use the city filter on the search page."
    },
    {
      question: "Can I use my current location?",
      answer:
        "Yes. If you allow browser location access, the search page can sort listings by distance. Coordinates are only used in the browser session."
    },
    {
      question: "Are opening hours always accurate?",
      answer:
        "Opening hours may change because of holidays, temporary closures or shop updates. Please verify details before visiting."
    },
    {
      question: "Does TobaccoNearby sell tobacco products?",
      answer:
        "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
    },
    {
      question: "Can I suggest a correction?",
      answer:
        "Yes. Use the report or add/update option to submit a correction suggestion. Submissions are reviewed before any listing changes are made."
    }
  ];
}
