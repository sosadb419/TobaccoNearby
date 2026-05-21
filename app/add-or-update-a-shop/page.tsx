import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Add or Update a Shop",
  description:
    "Submit a new Amsterdam tobacco shop listing or request an update to an existing TobaccoNearby listing."
};

export default function AddOrUpdateShopPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Listing updates</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Add or Update a Shop</h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">
            Submit a new shop or request an update to an existing listing. Submissions should focus on practical
            location information only.
          </p>

          <form className="mt-8 grid gap-5" aria-label="Add or update a shop form">
            <Field label="Shop name" id="shop-name" required />
            <Field label="Address" id="address" required />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="City" id="city" defaultValue="Amsterdam" required />
              <Field label="Country" id="country" defaultValue="Netherlands" required />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Neighborhood" id="neighborhood" required />
              <Field label="Postal code" id="postal-code" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Phone number" id="phone" />
              <Field label="Website" id="website" type="url" />
            </div>
            <Field label="Google Maps link" id="google-maps-link" type="url" />
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="opening-hours">
                Opening hours
              </label>
              <textarea
                className="focus-ring min-h-28 rounded-lg border border-line px-3 py-3 text-sm"
                id="opening-hours"
                name="opening-hours"
                placeholder="Example: Monday-Friday 09:00-18:00; Saturday 10:00-17:00"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="accessibility">
                Accessibility notes
              </label>
              <textarea
                className="focus-ring min-h-24 rounded-lg border border-line px-3 py-3 text-sm"
                id="accessibility"
                name="accessibility"
                placeholder="Wheelchair access, entrance notes, or unknown"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="source">
                Source of information
              </label>
              <textarea
                className="focus-ring min-h-24 rounded-lg border border-line px-3 py-3 text-sm"
                id="source"
                name="source"
                placeholder="Shop website, owner confirmation, public listing, or other source"
                required
              />
            </div>
            <Field label="Your email for verification" id="submitter-email" type="email" required />
            <button className="focus-ring w-fit rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-teal" type="button">
              Submit listing information
            </button>
            <p className="text-xs leading-5 text-muted">
              Demo form only. Connect this form to a backend review workflow before launch.
            </p>
          </form>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Product promotions, prices, inventory claims, and purchase requests should not be submitted.
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  defaultValue,
  required = false
}: {
  label: string;
  id: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        className="focus-ring rounded-lg border border-line px-3 py-3 text-sm"
        defaultValue={defaultValue}
        id={id}
        name={id}
        required={required}
        type={type}
      />
    </div>
  );
}
