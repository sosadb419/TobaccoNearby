import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: {
    absolute: "Disclaimer | TobaccoNearby"
  },
  description:
    "Read the TobaccoNearby disclaimer about shop data accuracy, verification, neutral directory content, and adult-only use.",
  alternates: {
    canonical: "/disclaimer"
  }
};

export default function DisclaimerPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Disclaimer</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Disclaimer</h1>
          <div className="mt-6 rounded-lg border border-amber/30 bg-amber/10 p-5">
            <p className="text-sm font-bold text-ink">
              Please verify opening hours and product availability before visiting.
            </p>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            TobaccoNearby provides neutral, informational directory data. Shop information may change without notice,
            including opening hours, temporary closures, accessibility conditions, public transport options, contact
            details, and available products.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            TobaccoNearby does not sell tobacco products, process online orders, provide product recommendations, show
            tobacco prices, or encourage tobacco use. This website is intended for adults aged 18+.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Demo listing data should be replaced with verified records before public launch.
          </p>
          <Link className="focus-ring mt-8 inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal" href="/search">
            Back to search
          </Link>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </section>
  );
}
