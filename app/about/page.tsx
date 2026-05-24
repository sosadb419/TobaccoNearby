import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: {
    absolute: "About TobaccoNearby | Amsterdam Tobacco Shop Directory"
  },
  description:
    "Learn about TobaccoNearby, a neutral English-language directory for adults looking for practical tobacco shop location information in Amsterdam.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">About TobaccoNearby</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Neutral Amsterdam shop information for adults</h1>
          <p className="mt-5 text-sm leading-6 text-muted">
            TobaccoNearby is an English-language directory for adults aged 18+ looking for practical location
            information about tobacco shops in Amsterdam. The site focuses on addresses, opening hours, directions,
            accessibility notes, nearby public transport, and contact details.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            TobaccoNearby does not sell tobacco products, process orders, display product prices, or encourage tobacco
            use. The directory is designed to be practical, neutral, and easy to expand to other Dutch cities later.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Info title="Amsterdam first" text="The first version focuses on Amsterdam neighborhoods and transit-oriented location pages." />
            <Info title="Verification focused" text="Each shop record includes a last updated date and a reminder to verify details before visiting." />
            <Info title="Scalable structure" text="Country, city, neighborhood, and shop routes are designed for later Dutch city expansion." />
          </div>

          <Link
            className="focus-ring mt-8 inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
            href="/search"
          >
            Search Amsterdam listings
          </Link>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            This website is intended for adults aged 18+.
          </div>
        </aside>
      </div>
    </section>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-4">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </section>
  );
}
