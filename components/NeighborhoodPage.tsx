import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import ShopMap from "@/components/ShopMap";
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
  intro: string;
  areaContext: string;
  shops: Shop[];
  searchHref: string;
  mapNote?: string;
};

export default function NeighborhoodPage({ title, intro, areaContext, shops, searchHref, mapNote }: NeighborhoodPageProps) {
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

      <div className="mt-8">
        <AdSlot placement="header" />
      </div>

      <DisclaimerNotice className="mt-8" />

      {shops.length > 0 ? (
        <div className="mt-6">
          <ShopMap shops={shops} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Listed shop locations</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Listings are loaded from Supabase when available, with local fallback records used only if Supabase is
            unavailable or returns no usable shop data.
          </p>
        </div>
        <Link className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal" href={searchHref}>
          Search this area
        </Link>
      </div>

      <div className="mt-6 grid gap-5">
        {shops.length > 0 ? (
          shops.map((shop, index) => (
            <div key={shop.slug} className="grid gap-5">
              <ShopCard shop={shop} />
              {index === 1 ? <AdSlot placement="in-content" /> : null}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-ink">No listings yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              This area page is ready for verified shop records as the directory expands.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Before visiting</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          TobaccoNearby does not sell tobacco products and does not encourage tobacco use. Use listings as practical
          directory information and confirm details with the shop before travelling.
        </p>
      </div>

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Other Amsterdam areas</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {areaLinks.map((link) => (
            <Link
              key={link.href}
              className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
