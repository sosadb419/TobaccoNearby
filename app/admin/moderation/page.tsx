import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MessageSquare, Reply } from "lucide-react";
import { getPendingModerationItems, getModerationReviewUrl, type ModerationItem } from "@/lib/moderation-notifications";
import { hasSupabaseAdminConfig } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ModerationPageProps = {
  searchParams: Promise<{
    id?: string;
    type?: string;
  }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "Moderation | TobaccoNearby"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function ModerationPage({ searchParams }: ModerationPageProps) {
  const params = await searchParams;
  const pendingItems = hasSupabaseAdminConfig ? await getPendingModerationItems(60) : [];

  return (
    <section className="container-shell py-8">
      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-teal">Internal</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Moderation</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Pending Community Notes, replies, and visitor-submitted shop photos are listed here for review. This page is
          protected and does not expose approve or reject actions yet.
        </p>
      </div>

      {!hasSupabaseAdminConfig ? (
        <div className="mt-6 rounded-lg border border-line bg-paper p-5 text-sm leading-6 text-muted">
          Supabase admin access is not configured. Add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel to view pending
          moderation items here.
        </div>
      ) : null}

      <section className="mt-6" aria-labelledby="pending-items-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="pending-items-heading" className="text-2xl font-bold text-ink">
              Pending submissions
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Showing the most recent pending items. Pending content is not shown publicly.
            </p>
          </div>
          <Link
            className="focus-ring rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal hover:text-teal"
            href={getModerationReviewUrl()}
          >
            Refresh list
          </Link>
        </div>

        {pendingItems.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {pendingItems.map((item) => (
              <ModerationItemCard
                key={`${item.sourceTable}-${item.id}`}
                item={item}
                isHighlighted={item.id === params.id}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            No pending moderation items are available.
          </div>
        )}
      </section>
    </section>
  );
}

function ModerationItemCard({ item, isHighlighted }: { item: ModerationItem; isHighlighted: boolean }) {
  const Icon = item.type === "Photo" ? Camera : item.type === "Reply" ? Reply : MessageSquare;

  return (
    <article
      className={`rounded-lg border bg-white p-5 shadow-sm ${
        isHighlighted ? "border-teal ring-2 ring-teal/20" : "border-line"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2 py-1 text-xs font-bold text-ink">
              <Icon aria-hidden="true" size={13} />
              {item.type}
            </span>
            <span className="text-xs text-muted">{formatDateTime(item.submittedAt)}</span>
          </div>
          <h3 className="mt-3 text-xl font-bold text-ink">{item.shopName}</h3>
          <p className="mt-1 text-sm text-muted">
            Shop slug:{" "}
            <Link className="font-semibold text-teal hover:text-ink" href={`/shops/${item.shopSlug}`}>
              {item.shopSlug}
            </Link>
          </p>
          {item.displayName ? <p className="mt-2 text-sm text-muted">Name: {item.displayName}</p> : null}
          {item.category ? <p className="mt-2 text-sm text-muted">Category: {item.category}</p> : null}
          {item.parentCommentId ? (
            <p className="mt-2 break-all text-sm text-muted">Parent comment ID: {item.parentCommentId}</p>
          ) : null}
          {item.storagePath ? <p className="mt-2 break-all text-sm text-muted">Storage path: {item.storagePath}</p> : null}
          {item.text ? (
            <p className="mt-4 rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted">{item.text}</p>
          ) : null}
        </div>

        {item.previewUrl ? (
          <a
            className="focus-ring block w-full shrink-0 overflow-hidden rounded-lg border border-line bg-paper md:w-56"
            href={item.previewUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img alt={`Pending submitted photo for ${item.shopName}`} className="aspect-[4/3] w-full object-cover" src={item.previewUrl} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Time not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam"
  }).format(date);
}
