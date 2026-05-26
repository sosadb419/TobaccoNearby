import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import { type ShopComment } from "@/data/comments";
import { getRecentApprovedComments } from "@/lib/shop-comments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Community Notes | TobaccoNearby"
  },
  description:
    "Read moderated practical community notes about listed Amsterdam shop locations, including opening hours, accessibility, directions, and contact details.",
  alternates: {
    canonical: "/forum"
  }
};

export default async function ForumPage() {
  const comments = await getRecentApprovedComments(12);

  return (
    <section className="container-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">Moderated updates</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Community Notes</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            TobaccoNearby allows moderated practical notes about listed locations. Visitors can submit updates about
            opening hours, accessibility, contact details, directions, or other location information. New notes are
            reviewed before publication.
          </p>
          <p className="mt-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
            This website is intended for adults aged 18+.
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-bold text-ink">Useful links</h2>
          <div className="mt-4 grid gap-3">
            <Link
              className="focus-ring inline-flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              href="/search"
            >
              Search listed shops
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              className="focus-ring inline-flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              href="/add-or-update-a-shop"
            >
              Add or update a shop
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </aside>
      </div>

      <DisclaimerNotice
        className="mt-8"
        text="Community notes are user-submitted and reviewed before publication. Information may change. Please verify details before visiting."
      />

      <section className="mt-8" aria-labelledby="recent-notes-heading">
        <div className="mb-5">
          <h2 id="recent-notes-heading" className="text-2xl font-bold text-ink">
            Recently approved community notes
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Only approved notes are shown publicly. Pending or rejected notes are not displayed.
          </p>
        </div>

        {comments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comments.map((comment) => (
              <ForumCommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-ink">No approved notes yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Approved community notes will appear here after review.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Moderation approach</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Community notes should stay practical and location-focused. TobaccoNearby does not publish product
          recommendations, prices, promotional wording, or open discussion threads.
        </p>
      </section>
    </section>
  );
}

function ForumCommentCard({ comment }: { comment: ShopComment }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-muted">
          {comment.category}
        </span>
        <span className="text-xs text-muted">{formatCommentDate(comment.created_at)}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-ink">
        <Link className="focus-ring rounded-md hover:text-teal" href={`/shops/${comment.shop_slug}`}>
          {comment.shop_name}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{comment.comment_text}</p>
      <p className="mt-3 text-xs font-semibold text-ink">{comment.display_name || "Anonymous visitor"}</p>
    </article>
  );
}

function formatCommentDate(value?: string) {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}
