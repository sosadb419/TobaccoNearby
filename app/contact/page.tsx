import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TobaccoNearby for questions, corrections, listing updates, privacy requests, or removal requests."
};

export default function ContactPage() {
  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-teal">Contact</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Contact TobaccoNearby</h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">
            Use this page for questions, corrections, privacy requests, or removal requests. If you manage a listed
            shop, the add or update form is the most direct way to submit listing changes.
          </p>

          <div className="mt-6 rounded-lg border border-line bg-paper p-5">
            <p className="text-sm font-semibold text-ink">Email</p>
            <a className="mt-2 inline-block text-sm font-bold text-teal hover:text-ink" href="mailto:hello@tobacconearby.com">
              hello@tobacconearby.com
            </a>
          </div>

          <form className="mt-8 grid gap-4" aria-label="Contact form">
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="name">
                Name
              </label>
              <input className="focus-ring rounded-lg border border-line px-3 py-3 text-sm" id="name" name="name" type="text" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="email">
                Email
              </label>
              <input className="focus-ring rounded-lg border border-line px-3 py-3 text-sm" id="email" name="email" type="email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold text-ink" htmlFor="message">
                Message
              </label>
              <textarea className="focus-ring min-h-36 rounded-lg border border-line px-3 py-3 text-sm" id="message" name="message" />
            </div>
            <button className="focus-ring w-fit rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-teal" type="button">
              Submit message
            </button>
            <p className="text-xs leading-5 text-muted">
              Demo form only. Connect this form to a backend or form service before launch.
            </p>
          </form>
        </article>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            Please do not submit tobacco orders or product purchase requests. TobaccoNearby is informational only.
          </div>
        </aside>
      </div>
    </section>
  );
}
