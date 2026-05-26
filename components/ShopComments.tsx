"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { commentCategories, type ShopComment } from "@/data/comments";
import { supabase } from "@/lib/supabase";

type ShopCommentsProps = {
  approvedComments: ShopComment[];
  shopId?: string;
  shopName: string;
  shopSlug: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const blockedPatterns = [
  "cheap",
  "deal",
  "discount",
  "best",
  "cigarettes",
  "tobacco products",
  "vape",
  "cannabis",
  "weed",
  "smoking"
];

export default function ShopComments({ approvedComments, shopId, shopName, shopSlug }: ShopCommentsProps) {
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = submitState === "submitting";
  const charactersRemaining = 800 - commentText.length;
  const flaggedTerm = useMemo(() => findBlockedPattern(commentText), [commentText]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedDisplayName = displayName.trim();
    const trimmedCategory = category.trim();
    const trimmedComment = commentText.trim();
    const blockedTerm = findBlockedPattern(trimmedComment);

    if (!trimmedCategory || !trimmedComment) {
      setSubmitState("error");
      setErrorMessage("Please choose a category and add a note before submitting.");
      return;
    }

    if (trimmedComment.length < 10) {
      setSubmitState("error");
      setErrorMessage("Please add at least 10 characters.");
      return;
    }

    if (trimmedComment.length > 800) {
      setSubmitState("error");
      setErrorMessage("Please keep your note under 800 characters.");
      return;
    }

    if (!commentCategories.includes(trimmedCategory as (typeof commentCategories)[number])) {
      setSubmitState("error");
      setErrorMessage("Please choose one of the listed categories.");
      return;
    }

    if (blockedTerm) {
      setSubmitState("error");
      setErrorMessage(
        "Please keep notes practical and non-promotional. Avoid product recommendations, price-focused wording, or promotional language."
      );
      return;
    }

    if (!supabase) {
      setSubmitState("error");
      setErrorMessage("The community notes form is temporarily unavailable. Please try again later.");
      return;
    }

    setSubmitState("submitting");

    const { error } = await supabase.from("shop_comments").insert({
      shop_id: isUuid(shopId) ? shopId : null,
      shop_slug: shopSlug,
      shop_name: shopName,
      display_name: trimmedDisplayName || null,
      comment_text: trimmedComment,
      category: trimmedCategory,
      status: "pending"
    });

    if (error) {
      console.error("Supabase shop_comments insert failed.", error);
      setSubmitState("error");
      setErrorMessage("We could not submit your note right now. Please try again later.");
      return;
    }

    setSubmitState("success");
    setDisplayName("");
    setCategory("");
    setCommentText("");
  }

  return (
    <section className="mt-8 rounded-lg border border-line bg-white p-5 shadow-sm" aria-labelledby="community-notes-heading">
      <div className="max-w-3xl">
        <h2 id="community-notes-heading" className="text-2xl font-bold text-ink">
          Community notes
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Visitors can submit practical notes about this location, such as opening hours, accessibility, contact
          details, or directions. Submitted notes are reviewed before publication.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)] lg:items-start">
        <div className="grid gap-4">
          {approvedComments.length > 0 ? (
            approvedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <div className="rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted">
              No approved community notes are available for this listing yet.
            </div>
          )}
        </div>

        <form className="grid gap-4 rounded-lg border border-line bg-paper p-4" onSubmit={handleSubmit}>
          {submitState === "success" ? (
            <p className="text-sm font-medium leading-6 text-ink">
              Thank you. Your note has been submitted and will be reviewed before publication.
            </p>
          ) : (
            <>
              <p className="text-sm leading-6 text-muted">
                Add a practical note for review. Please do not include product recommendations, price-focused wording,
                or promotional language.
              </p>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${shopSlug}-comment-display-name`}>
                  Display name, optional
                </label>
                <input
                  className="focus-ring rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${shopSlug}-comment-display-name`}
                  maxLength={80}
                  name="display_name"
                  onChange={(event) => setDisplayName(event.target.value)}
                  type="text"
                  value={displayName}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${shopSlug}-comment-category`}>
                  Category
                </label>
                <select
                  className="focus-ring rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${shopSlug}-comment-category`}
                  name="category"
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  value={category}
                >
                  <option value="">Select a category</option>
                  {commentCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-ink" htmlFor={`${shopSlug}-comment-text`}>
                  Comment text
                </label>
                <textarea
                  className="focus-ring min-h-32 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink"
                  id={`${shopSlug}-comment-text`}
                  maxLength={800}
                  minLength={10}
                  name="comment_text"
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                  value={commentText}
                />
                <p className="text-xs leading-5 text-muted">{charactersRemaining} characters remaining.</p>
              </div>

              {flaggedTerm ? (
                <p className="rounded-lg border border-line bg-white px-3 py-2 text-sm leading-6 text-muted">
                  Please keep notes practical and neutral. The word "{flaggedTerm}" may be promotional or outside the
                  scope of location information.
                </p>
              ) : null}

              {errorMessage ? <p className="text-sm leading-6 text-amber">{errorMessage}</p> : null}

              <button
                className="focus-ring rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit note for review"}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

export function CommentCard({ comment }: { comment: ShopComment }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line bg-paper px-2 py-1 text-xs font-semibold text-muted">
          {comment.category}
        </span>
        <span className="text-xs text-muted">{formatCommentDate(comment.created_at)}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{comment.comment_text}</p>
      <p className="mt-3 text-xs font-semibold text-ink">{comment.display_name || "Anonymous visitor"}</p>
    </article>
  );
}

function findBlockedPattern(value: string) {
  const normalizedValue = value.toLowerCase();

  return blockedPatterns.find((pattern) => normalizedValue.includes(pattern));
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

function isUuid(value?: string) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}
