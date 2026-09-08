"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { commentCategories, type ShopComment } from "@/data/comments";
import { supabase } from "@/lib/supabase";

type ShopCommentsProps = {
  approvedComments: ShopComment[];
  shopId?: string;
  shopName: string;
  shopSlug: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";
type ReplyState = Record<string, { displayName: string; text: string; state: SubmitState; error: string }>;
type LikeState = Record<string, boolean>;

const visitorStorageKey = "tobacconearby_community_visitor_id";

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
  const [comments, setComments] = useState<ShopComment[]>(approvedComments);
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyState, setReplyState] = useState<ReplyState>({});
  const [pendingLikes, setPendingLikes] = useState<LikeState>({});
  const isSubmitting = submitState === "submitting";
  const charactersRemaining = 800 - commentText.length;
  const flaggedTerm = useMemo(() => findBlockedPattern(commentText), [commentText]);

  useEffect(() => {
    setComments(approvedComments);
  }, [approvedComments]);

  useEffect(() => {
    const commentIds = approvedComments.map((comment) => comment.id);

    if (!supabase || commentIds.length === 0) {
      return;
    }

    const visitorId = getOrCreateVisitorId();

    if (!visitorId) {
      return;
    }

    let isMounted = true;

    supabase
      .rpc("get_liked_shop_comment_ids", {
        target_comment_ids: commentIds,
        target_visitor_id: visitorId
      })
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Supabase liked shop_comment ids fetch failed.", error);
          return;
        }

        const likedRows = Array.isArray(data) ? (data as Array<string | { comment_id?: unknown }>) : [];
        const likedIds = new Set(
          likedRows
            .map((item) => (typeof item === "string" ? item : item.comment_id))
            .filter((id): id is string => typeof id === "string")
        );

        setComments((currentComments) =>
          currentComments.map((comment) => ({
            ...comment,
            visitor_has_liked: likedIds.has(comment.id)
          }))
        );
      });

    return () => {
      isMounted = false;
    };
  }, [approvedComments]);

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

  async function handleLikeToggle(comment: ShopComment) {
    if (!supabase || pendingLikes[comment.id]) {
      return;
    }

    const visitorId = getOrCreateVisitorId();

    if (!visitorId) {
      return;
    }

    const wasLiked = Boolean(comment.visitor_has_liked);
    const nextLiked = !wasLiked;
    const nextCount = Math.max(0, comment.like_count + (nextLiked ? 1 : -1));

    setPendingLikes((current) => ({ ...current, [comment.id]: true }));
    setComments((currentComments) =>
      currentComments.map((item) =>
        item.id === comment.id ? { ...item, visitor_has_liked: nextLiked, like_count: nextCount } : item
      )
    );

    const { data, error } = nextLiked
      ? await supabase.rpc("like_shop_comment", {
          target_comment_id: comment.id,
          target_visitor_id: visitorId
        })
      : await supabase.rpc("unlike_shop_comment", {
          target_comment_id: comment.id,
          target_visitor_id: visitorId
        });

    setPendingLikes((current) => {
      const next = { ...current };
      delete next[comment.id];
      return next;
    });

    if (error) {
      console.error("Supabase shop_comment like toggle failed.", error);
      setComments((currentComments) =>
        currentComments.map((item) =>
          item.id === comment.id ? { ...item, visitor_has_liked: wasLiked, like_count: comment.like_count } : item
        )
      );
      return;
    }

    const confirmedCount = typeof data === "number" && Number.isFinite(data) ? Math.max(0, Math.trunc(data)) : nextCount;

    setComments((currentComments) =>
      currentComments.map((item) => (item.id === comment.id ? { ...item, like_count: confirmedCount } : item))
    );
  }

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>, parentComment: ShopComment) {
    event.preventDefault();

    const currentReply = getReplyState(replyState, parentComment.id);
    const trimmedDisplayName = currentReply.displayName.trim();
    const trimmedReply = currentReply.text.trim();
    const blockedTerm = findBlockedPattern(trimmedReply);

    if (!trimmedReply) {
      setReplyFeedback(parentComment.id, "error", "Please add a reply before submitting.");
      return;
    }

    if (trimmedReply.length < 5) {
      setReplyFeedback(parentComment.id, "error", "Please add at least 5 characters.");
      return;
    }

    if (trimmedReply.length > 500) {
      setReplyFeedback(parentComment.id, "error", "Please keep your reply under 500 characters.");
      return;
    }

    if (blockedTerm) {
      setReplyFeedback(
        parentComment.id,
        "error",
        "Please keep replies practical and non-promotional. Avoid product recommendations, price-focused wording, or promotional language."
      );
      return;
    }

    if (!supabase) {
      setReplyFeedback(parentComment.id, "error", "The reply form is temporarily unavailable. Please try again later.");
      return;
    }

    updateReplyState(parentComment.id, { state: "submitting", error: "" });

    const { error } = await supabase.from("shop_comments").insert({
      shop_id: isUuid(shopId) ? shopId : null,
      shop_slug: shopSlug,
      shop_name: shopName,
      parent_comment_id: parentComment.id,
      display_name: trimmedDisplayName || null,
      comment_text: trimmedReply,
      category: parentComment.category,
      status: "pending"
    });

    if (error) {
      console.error("Supabase shop_comments reply insert failed.", error);
      setReplyFeedback(parentComment.id, "error", "We could not submit your reply right now. Please try again later.");
      return;
    }

    setReplyState((current) => ({
      ...current,
      [parentComment.id]: {
        displayName: "",
        text: "",
        state: "success",
        error: ""
      }
    }));
  }

  function updateReplyState(commentId: string, patch: Partial<ReplyState[string]>) {
    setReplyState((current) => ({
      ...current,
      [commentId]: {
        ...getReplyState(current, commentId),
        ...patch
      }
    }));
  }

  function setReplyFeedback(commentId: string, state: SubmitState, error: string) {
    updateReplyState(commentId, { state, error });
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
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isReplyOpen={openReplyId === comment.id}
                isLikePending={Boolean(pendingLikes[comment.id])}
                onLikeToggle={handleLikeToggle}
                onReplySubmit={handleReplySubmit}
                onReplyToggle={() => setOpenReplyId((currentId) => (currentId === comment.id ? null : comment.id))}
                replyState={getReplyState(replyState, comment.id)}
                updateReplyState={updateReplyState}
              />
            ))
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

type CommentCardProps = {
  comment: ShopComment;
  isLikePending: boolean;
  isReplyOpen: boolean;
  onLikeToggle: (comment: ShopComment) => void;
  onReplySubmit: (event: FormEvent<HTMLFormElement>, comment: ShopComment) => void;
  onReplyToggle: () => void;
  replyState: ReplyState[string];
  updateReplyState: (commentId: string, patch: Partial<ReplyState[string]>) => void;
};

export function CommentCard({
  comment,
  isLikePending,
  isReplyOpen,
  onLikeToggle,
  onReplySubmit,
  onReplyToggle,
  replyState,
  updateReplyState
}: CommentCardProps) {
  const remainingReplyCharacters = 500 - replyState.text.length;
  const replyFlaggedTerm = useMemo(() => findBlockedPattern(replyState.text), [replyState.text]);

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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          aria-pressed={Boolean(comment.visitor_has_liked)}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLikePending}
          onClick={() => onLikeToggle(comment)}
          type="button"
        >
          <Heart aria-hidden="true" fill={comment.visitor_has_liked ? "currentColor" : "none"} size={14} />
          Helpful {comment.like_count}
        </button>
        <button
          aria-expanded={isReplyOpen}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-teal hover:text-teal"
          onClick={onReplyToggle}
          type="button"
        >
          <MessageSquare aria-hidden="true" size={14} />
          Reply
        </button>
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-4 grid gap-3 border-l-2 border-line pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg bg-paper px-3 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-ink">{reply.display_name || "Anonymous visitor"}</span>
                <span>{formatCommentDate(reply.created_at)}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{reply.comment_text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {isReplyOpen ? (
        <form className="mt-4 grid gap-3 rounded-lg border border-line bg-paper p-3" onSubmit={(event) => onReplySubmit(event, comment)}>
          {replyState.state === "success" ? (
            <p className="text-sm font-medium leading-6 text-ink">
              Thanks. Your reply has been submitted for review.
            </p>
          ) : (
            <>
              <p className="text-xs leading-5 text-muted">
                Replies are reviewed before publication. Keep them practical and location-focused.
              </p>
              <div className="grid gap-2">
                <label className="text-xs font-bold text-ink" htmlFor={`${comment.id}-reply-display-name`}>
                  Display name, optional
                </label>
                <input
                  className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                  id={`${comment.id}-reply-display-name`}
                  maxLength={80}
                  onChange={(event) => updateReplyState(comment.id, { displayName: event.target.value, state: "idle", error: "" })}
                  type="text"
                  value={replyState.displayName}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold text-ink" htmlFor={`${comment.id}-reply-text`}>
                  Reply text
                </label>
                <textarea
                  className="focus-ring min-h-24 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                  id={`${comment.id}-reply-text`}
                  maxLength={500}
                  minLength={5}
                  onChange={(event) => updateReplyState(comment.id, { text: event.target.value, state: "idle", error: "" })}
                  required
                  value={replyState.text}
                />
                <p className="text-xs leading-5 text-muted">{remainingReplyCharacters} characters remaining.</p>
              </div>
              {replyFlaggedTerm ? (
                <p className="rounded-lg border border-line bg-white px-3 py-2 text-xs leading-5 text-muted">
                  Please keep replies practical and neutral. The word "{replyFlaggedTerm}" may be outside the scope of
                  location information.
                </p>
              ) : null}
              {replyState.error ? <p className="text-sm leading-6 text-amber">{replyState.error}</p> : null}
              <button
                className="focus-ring rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-70"
                disabled={replyState.state === "submitting"}
                type="submit"
              >
                {replyState.state === "submitting" ? "Submitting..." : "Submit reply for review"}
              </button>
            </>
          )}
        </form>
      ) : null}
    </article>
  );
}

function getReplyState(replyState: ReplyState, commentId: string) {
  return (
    replyState[commentId] ?? {
      displayName: "",
      text: "",
      state: "idle",
      error: ""
    }
  );
}

function getOrCreateVisitorId() {
  if (typeof window === "undefined") {
    return null;
  }

  const existingId = window.localStorage.getItem(visitorStorageKey);

  if (existingId && /^[a-zA-Z0-9-]{20,80}$/.test(existingId)) {
    return existingId;
  }

  const nextId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  window.localStorage.setItem(visitorStorageKey, nextId);

  return nextId;
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
