import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Map, Navigation, ShieldCheck } from "lucide-react";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection from "@/components/FAQSection";
import HomeQuickActions from "@/components/HomeQuickActions";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { areaDefinitions } from "@/data/areas";
import { seoLandingPages } from "@/data/seo-pages";
import { getAllShops } from "@/lib/shop-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = "https://tobacconearby.com";

export const metadata: Metadata = {
  title: {
    absolute: "TobaccoNearby | Find Tobacco Shops Near You in Amsterdam"
  },
  description:
    "Search for practical information about tobacco shops in Amsterdam, including addresses, opening hours, directions, accessibility notes, and contact details.",
  alternates: {
    canonical: "/"
  }
};

const homepageFaqs = [
  {
    question: "What is TobaccoNearby?",
    answer:
      "TobaccoNearby is a neutral English-language directory that provides practical location information for listed tobacco shops in Amsterdam."
  },
  {
    question: "Is this website intended for adults aged 18+?",
    answer:
      "Yes. TobaccoNearby is intended for adults aged 18+ and provides neutral, practical location information only."
  },
  {
    question: "Does TobaccoNearby sell tobacco products?",
    answer:
      "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. The website only provides practical shop location information."
  },
  {
    question: "How can I search for tobacco shops in Amsterdam?",
    answer:
      "Use the search bar to search by area, postal code, street or neighborhood, then review addresses, opening hours and directions where available."
  },
  {
    question: "Can I use my current location?",
    answer:
      "Yes. If you allow browser location access, the search page can sort listings by distance. Exact coordinates are not sent to analytics."
  }
];

export default async function HomePage() {
  const shops = await getAllShops();
  const featuredShops = shops.slice(0, 3);
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "TobaccoNearby",
    url: siteUrl,
    inLanguage: "en",
    audience: {
      "@type": "PeopleAudience",
      requiredMinAge: 18
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-shell grid gap-5 py-4 md:gap-8 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div className="grid gap-3 md:block">
            <p className="hidden text-sm font-bold uppercase text-teal md:block">TobaccoNearby</p>
            <h1 className="sr-only md:not-sr-only md:mt-3 md:max-w-3xl md:text-5xl md:font-bold md:leading-tight md:text-ink">
              Find Tobacco Shops Near You in Amsterdam
            </h1>
            <p className="hidden max-w-2xl text-base leading-7 text-muted md:mt-5 md:block md:text-lg">
              Search by area, postal code, or neighborhood to find practical information such as shop locations,
              opening hours, directions, accessibility notes, and contact details.
            </p>
            <p className="hidden rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink md:mt-4 md:block">
              This website is intended for adults aged 18+.
            </p>
            <div className="order-1 md:mt-7">
              <SearchBar
                helperText={null}
                placeholder="Search by area, postal code, or neighborhood"
                showLocationButton={false}
                submitLabel="Find shops"
              />
            </div>
            <HomeQuickActions className="order-2 mt-1 md:mt-5" />
            <p className="order-3 text-sm leading-6 text-muted md:hidden">
              Neutral location information for adults aged 18+, including addresses, opening hours, directions and
              contact details where available.
            </p>
            <DisclaimerNotice className="mt-5 hidden bg-white md:block" />
          </div>

          <div className="map-grid relative hidden min-h-[280px] overflow-hidden rounded-lg border border-line bg-paper p-5 shadow-soft sm:min-h-[360px] lg:block">
            <div className="absolute left-8 top-8 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Map aria-hidden="true" size={18} />
                Amsterdam only
              </div>
              <p className="mt-2 max-w-[14rem] text-sm leading-5 text-muted">
                Built for Amsterdam first, structured to support more Dutch cities later.
              </p>
            </div>
            <div className="absolute bottom-8 right-8 w-[min(78%,22rem)] rounded-lg border border-line bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-teal">Practical details</p>
              <div className="mt-4 grid gap-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Clock aria-hidden="true" size={16} />
                  Opening hours
                </span>
                <span className="flex items-center gap-2">
                  <Navigation aria-hidden="true" size={16} />
                  Directions
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" size={16} />
                  Verification reminder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="amsterdam-neighborhoods" className="container-shell scroll-mt-6 py-5 md:py-8" aria-labelledby="amsterdam-neighborhoods-heading">
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-6">
          <div>
            <h2 id="amsterdam-neighborhoods-heading" tabIndex={-1} className="focus-ring rounded-md text-xl font-bold text-ink md:text-2xl">
              Browse Amsterdam neighborhoods
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Use neighborhood pages to narrow results before checking shop details and directions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
            {areaDefinitions.map((neighborhood) => (
              <TrackedNeighborhoodLink
                key={neighborhood.href}
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:border-teal hover:text-teal md:px-4 md:py-3"
                href={neighborhood.href}
                neighborhood={neighborhood.label}
              >
                {neighborhood.label}
              </TrackedNeighborhoodLink>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-5 md:py-8" aria-labelledby="key-amsterdam-pages-heading">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="key-amsterdam-pages-heading" className="text-xl font-bold text-ink md:text-2xl">
                Key Amsterdam pages
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Start with search or browse neutral location pages for Amsterdam listings, addresses, opening hours
                and directions.
              </p>
            </div>
            <Link
              className="focus-ring inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-teal"
              href="/search"
            >
              Search
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {seoLandingPages.map((page) => (
              <Link
                key={page.href}
                className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
                href={page.href}
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-5 md:py-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-6">
          <div>
            <h2 className="text-xl font-bold text-ink md:text-2xl">Recently updated Amsterdam listings</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Published listings are loaded from Supabase, with local fallback records used only if the service is
              unavailable.
            </p>
          </div>
          <Link className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-bold text-teal" href="/search">
            View all listings
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-5">
          {featuredShops.length > 0 ? (
            featuredShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-lg font-bold text-ink">No published listings available</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Published shop information will appear here when records are available.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="container-shell py-5 md:py-8">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-bold text-ink">Neutral information only</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            TobaccoNearby does not sell tobacco products, process orders, show prices, or encourage tobacco use. Shop
            data may change, so users should verify opening hours and product availability before visiting.
          </p>
        </div>
      </section>

      <div className="container-shell py-4 md:hidden">
        <DisclaimerNotice />
      </div>

      <div className="container-shell py-5 md:py-8">
        <FAQSection
          id="homepage-faq"
          items={homepageFaqs}
          intro="General answers about using TobaccoNearby as a practical Amsterdam directory."
        />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}
