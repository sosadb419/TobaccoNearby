import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { areaDefinitions } from "@/data/areas";
import { seoLandingPages, SeoLandingPageDefinition } from "@/data/seo-pages";
import { Shop } from "@/data/shops";

type SeoLandingPageProps = {
  page: SeoLandingPageDefinition;
  shops: Shop[];
};

export default function SeoLandingPage({ page, shops }: SeoLandingPageProps) {
  const pageId = slugifyId(page.h1);

  return (
    <section className="container-shell py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">Amsterdam location information</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{page.intro}</p>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>
          <div className="mt-6">
            <SearchBar
              compact
              helperText="Search by area, postal code, street, station, or neighborhood."
              placeholder="Search by area, postal code, street, or neighborhood"
            />
          </div>
        </div>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Practical note</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Shop details may change. Verify opening hours, contact information, accessibility details and
              availability before visiting.
            </p>
          </div>
        </aside>
      </div>

      <DisclaimerNotice className="mt-8" />

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">About this page</h2>
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
              Listed Amsterdam shop locations
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Published listings are loaded from Supabase, with local fallback records used only if Supabase cannot be
              reached.
            </p>
          </div>
          <Link
            className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-teal"
            href="/search"
          >
            Open full search
          </Link>
        </div>

        <div className="mt-6 grid gap-5">
          {shops.length > 0 ? (
            shops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">No published listings available</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Published Amsterdam shop information will appear here when records are available.
              </p>
            </div>
          )}
        </div>
      </section>

      {shops.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${pageId}-map-heading`}>
          <div className="mb-4">
            <h2 id={`${pageId}-map-heading`} className="text-2xl font-bold text-ink">
              Map of listed shop locations
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Map markers are approximate and provided for practical location reference only.
            </p>
          </div>
          <LazyShopMap shops={shops} />
        </section>
      ) : null}

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Amsterdam area pages</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Browse local area pages for more specific address, opening-hour, direction and contact information.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {areaDefinitions.map((area) => (
            <TrackedNeighborhoodLink
              key={area.href}
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
              href={area.href}
              neighborhood={area.label}
            >
              {area.label}
            </TrackedNeighborhoodLink>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Related practical search pages</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          These pages use neutral wording and link to the same practical Amsterdam directory information.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {seoLandingPages.map((relatedPage) => (
            <Link
              key={relatedPage.href}
              className={`focus-ring rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                relatedPage.href === page.href
                  ? "border-teal bg-teal text-white"
                  : "border-line bg-white text-muted hover:border-teal hover:text-teal"
              }`}
              href={relatedPage.href}
            >
              {relatedPage.label}
            </Link>
          ))}
        </div>
      </section>

      <FAQSection
        className="mt-8"
        id={`${pageId}-faq`}
        items={page.faqs}
        intro="Answers are neutral and practical. Shop details may change, so verify important information before visiting."
      />
    </section>
  );
}

function slugifyId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
