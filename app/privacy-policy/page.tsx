import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the TobaccoNearby privacy policy covering analytics, location permission, contact form data, cookies, and data retention."
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Privacy Policy</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Privacy Policy</h1>
          <p className="mt-5 text-sm leading-6 text-muted">Last updated: 23 May 2026</p>

          <PolicySection title="Information we collect">
            TobaccoNearby may collect information you submit through contact or listing update forms, such as your name,
            email address, shop details, and correction notes. We use Vercel Web Analytics for aggregate website
            measurement, including page views and limited interaction events.
          </PolicySection>

          <PolicySection title="Location permission">
            The “Use my current location” feature uses browser geolocation only after you grant permission. Location
            data is used to sort nearby listings in your browser session and should not be stored unless a future
            feature clearly explains otherwise.
          </PolicySection>

          <PolicySection title="Cookies and analytics">
            Analytics interaction events use controlled labels only, such as a neighborhood name, listing slug, search
            type, or submission type. We do not include exact location coordinates, raw search queries, addresses,
            phone numbers, personal email addresses, or text entered into forms in analytics events. Advertising
            partners may use cookies or similar technologies if ads are enabled.
          </PolicySection>

          <PolicySection title="Data retention">
            Contact and listing update submissions should be kept only as long as needed to review, respond, prevent
            abuse, or maintain accurate shop records.
          </PolicySection>

          <PolicySection title="Your rights">
            You may request access, correction, or deletion of personal information by contacting
            hello@tobacconearby.com.
          </PolicySection>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </section>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 border-t border-line pt-6">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{children}</p>
    </section>
  );
}
