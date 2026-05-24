import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Use | TobaccoNearby"
  },
  description:
    "Read the TobaccoNearby terms of use for informational directory content, listing accuracy, acceptable use, and third-party links.",
  alternates: {
    canonical: "/terms-of-use"
  }
};

export default function TermsOfUsePage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Terms of Use</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Terms of Use</h1>
          <p className="mt-5 text-sm leading-6 text-muted">Last updated: 21 May 2026</p>

          <TermsSection title="Informational use only">
            TobaccoNearby provides neutral directory information for adults aged 18+. The website does not sell tobacco
            products, process orders, show product prices, or encourage tobacco use.
          </TermsSection>

          <TermsSection title="Listing accuracy">
            Shop details may change without notice. You are responsible for verifying opening hours, contact details,
            accessibility information, and product availability before visiting any location.
          </TermsSection>

          <TermsSection title="Acceptable use">
            Do not use the website to submit false listing data, spam, abusive messages, unlawful content, or purchase
            requests. Update submissions may be reviewed before publication.
          </TermsSection>

          <TermsSection title="Third-party links">
            TobaccoNearby may link to shop websites, Google Maps, public transport information, or advertising partners.
            We are not responsible for third-party websites or their content.
          </TermsSection>

          <TermsSection title="Changes">
            These terms may be updated as the website expands or as legal requirements change.
          </TermsSection>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </section>
  );
}

function TermsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 border-t border-line pt-6">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{children}</p>
    </section>
  );
}
