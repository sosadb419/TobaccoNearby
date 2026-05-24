import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import ShopSubmissionForm from "@/components/ShopSubmissionForm";

export const metadata: Metadata = {
  title: {
    absolute: "Add or Update a Shop | TobaccoNearby"
  },
  description:
    "Submit a new Amsterdam shop, suggest an update, or request removal of outdated information for manual review.",
  alternates: {
    canonical: "/add-or-update-a-shop"
  }
};

export default function AddOrUpdateShopPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Listing updates</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Add or Update a Shop</h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">
            Submit a new shop, suggest an update, or request removal of outdated information. All submissions are
            reviewed before any changes are made.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Visitors cannot directly edit, update, delete, or publish shop listings. This form only sends information
            for manual review.
          </p>

          <ShopSubmissionForm />
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Product promotions, prices, inventory claims, and purchase requests should not be submitted.
          </div>
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Submitted information is stored separately from published shop listings until it has been reviewed.
          </div>
        </aside>
      </div>
    </section>
  );
}
