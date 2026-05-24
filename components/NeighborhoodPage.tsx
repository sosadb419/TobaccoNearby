import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import LazyShopMap from "@/components/LazyShopMap";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { TrackedNeighborhoodLink } from "@/components/TrackedLinks";
import { Shop } from "@/data/shops";

const areaLinks = [
  { href: "/amsterdam/centrum", label: "Centrum" },
  { href: "/amsterdam/de-pijp", label: "De Pijp" },
  { href: "/amsterdam/jordaan", label: "Jordaan" },
  { href: "/amsterdam/de-wallen", label: "De Wallen" },
  { href: "/amsterdam/west", label: "West" },
  { href: "/amsterdam/oost", label: "Oost" },
  { href: "/amsterdam/noord", label: "Noord" },
  { href: "/amsterdam/zuid", label: "Zuid" },
  { href: "/amsterdam/zuidoost", label: "Zuidoost" },
  { href: "/amsterdam/near-central-station", label: "Amsterdam Central Station" }
];

type NeighborhoodPageProps = {
  title: string;
  areaName: string;
  intro: string;
  areaContext: string;
  practicalInfo: string[];
  shops: Shop[];
  searchHref: string;
  mapNote?: string;
  faqs?: NeighborhoodFaq[];
};

export type NeighborhoodFaq = {
  question: string;
  answer: string;
};

export default function NeighborhoodPage({
  title,
  areaName,
  intro,
  areaContext,
  practicalInfo,
  shops,
  searchHref,
  mapNote,
  faqs
}: NeighborhoodPageProps) {
  const pageFaqs = faqs ?? getDefaultFaqs(areaName);
  const areaId = slugifyId(areaName);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">Amsterdam area guide</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{intro}</p>
          <div className="mt-5 rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Area context</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{areaContext}</p>
          </div>
          <div className="mt-5 rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">Practical information</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {practicalInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
              Opening hours can change because of holidays, temporary closures, staffing, or local conditions. Please
              verify opening hours, accessibility information and contact details before visiting.
            </p>
          </div>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>
          <div className="mt-6">
            <SearchBar compact />
          </div>
        </div>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            {mapNote ?? "Distances are approximate. Please verify shop details before visiting."}
          </div>
        </aside>
      </div>

      <DisclaimerNotice className="mt-8" />

      <section className="mt-8" aria-labelledby={`${areaId}-listings-heading`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id={`${areaId}-listings-heading`} className="text-2xl font-bold text-ink">
              Search or listings in {areaName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Published listings are loaded from Supabase, with local fallback records used only if the service cannot
              be reached.
            </p>
          </div>
          <Link
            className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
            href={searchHref}
          >
            Search this area
          </Link>
        </div>

        <div className="mt-6 grid gap-5">
          {shops.length > 0 ? (
            shops.map((shop) => (
              <div key={shop.slug}>
                <ShopCard shop={shop} />
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">No listings yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                This area page is ready for published shop records as the directory expands.
              </p>
            </div>
          )}
        </div>
      </section>

      {shops.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${areaId}-map-heading`}>
          <div className="mb-4">
            <h2 id={`${areaId}-map-heading`} className="text-2xl font-bold text-ink">
              Map of listed shop locations
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Map markers are approximate and are provided for practical location reference only.
            </p>
          </div>
          <LazyShopMap shops={shops} />
        </section>
      ) : null}

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Before visiting</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          TobaccoNearby does not sell tobacco products and does not encourage tobacco use. Use listings as practical
          directory information and confirm details with the shop before travelling.
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Nearby Amsterdam areas</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Browse other Amsterdam area pages for nearby shop locations, opening hours, directions and contact details.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {areaLinks.map((link) => (
            <TrackedNeighborhoodLink
              key={link.href}
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
              href={link.href}
              neighborhood={link.label}
            >
              {link.label}
            </TrackedNeighborhoodLink>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white p-5" aria-labelledby={`${areaId}-faq-heading`}>
        <h2 id={`${areaId}-faq-heading`} className="text-lg font-bold text-ink">
          FAQ
        </h2>
        <div className="mt-4 grid gap-4">
          {pageFaqs.map((faq) => (
            <section key={faq.question} className="border-t border-line pt-4">
              <h3 className="text-base font-bold text-ink">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
            </section>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}

function getDefaultFaqs(areaName: string): NeighborhoodFaq[] {
  return [
    {
      question: `How can I find tobacco shops in ${areaName}?`,
      answer: `Use the listings on this page or search by area, postal code, street or neighborhood. Each listing focuses on practical details such as address, opening hours and directions.`
    },
    {
      question: `Are opening hours for ${areaName} always accurate?`,
      answer:
        "Opening hours may change without notice. Please verify opening hours and contact details with the shop before visiting."
    },
    {
      question: `Can I get directions to listed shops in ${areaName}?`,
      answer:
        "Yes. When a listing includes a map link, use the directions button to open route information in Google Maps."
    },
    {
      question: "Does TobaccoNearby sell tobacco products?",
      answer:
        "No. TobaccoNearby is an informational directory only. It does not sell products, process orders or promote smoking."
    },
    {
      question: "Can I report incorrect shop information?",
      answer:
        "Yes. Use the report incorrect information option on a shop detail page to submit a correction suggestion for review."
    },
    {
      question: "Is this website intended for adults aged 18+?",
      answer: "Yes. TobaccoNearby is intended for adults aged 18+."
    }
  ];
}

function slugifyId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
