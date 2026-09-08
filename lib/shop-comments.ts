import { cache } from "react";
import type { ShopComment } from "@/data/comments";
import { supabase } from "@/lib/supabase";

type SupabaseCommentRow = Record<string, unknown>;

const commentSelectColumns =
  "id,shop_id,shop_slug,shop_name,parent_comment_id,display_name,comment_text,category,status,created_at,updated_at";

const legacyCommentSelectColumns =
  "id,shop_id,shop_slug,shop_name,display_name,comment_text,category,status,created_at,updated_at";

export const getApprovedCommentsForShop = cache(async (shopSlug: string): Promise<ShopComment[]> => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase.rpc("get_approved_shop_comments", {
      target_shop_slug: shopSlug,
      top_level_limit: 20
    });

    if (error) {
      console.error("Supabase approved shop_comments RPC fetch failed. Falling back to table query.", error);
      return fetchApprovedCommentsForShopFromTable(shopSlug);
    }

    return buildCommentTree(data ?? []);
  } catch (error) {
    console.error("Unexpected Supabase approved shop_comments RPC fetch failure. Falling back to table query.", error);
    return fetchApprovedCommentsForShopFromTable(shopSlug);
  }
});

export const getRecentApprovedComments = cache(async (limit = 12): Promise<ShopComment[]> => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("shop_comments")
      .select(commentSelectColumns)
      .eq("status", "approved")
      .is("parent_comment_id", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase recent shop_comments fetch failed. Retrying without reply column.", error);
      return fetchRecentApprovedCommentsLegacy(limit);
    }

    return (data ?? []).map(mapCommentRow).filter(Boolean) as ShopComment[];
  } catch (error) {
    console.error("Unexpected Supabase recent shop_comments fetch failure. Retrying without reply column.", error);
    return fetchRecentApprovedCommentsLegacy(limit);
  }
});

async function fetchApprovedCommentsForShopFromTable(shopSlug: string): Promise<ShopComment[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("shop_comments")
      .select(commentSelectColumns)
      .eq("shop_slug", shopSlug)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) {
      console.error("Supabase approved shop_comments table fetch failed. Retrying legacy columns.", error);
      return fetchApprovedCommentsForShopLegacy(shopSlug);
    }

    return buildCommentTree(data ?? []);
  } catch (error) {
    console.error("Unexpected Supabase approved shop_comments table fetch failure. Retrying legacy columns.", error);
    return fetchApprovedCommentsForShopLegacy(shopSlug);
  }
}

async function fetchApprovedCommentsForShopLegacy(shopSlug: string): Promise<ShopComment[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("shop_comments")
      .select(legacyCommentSelectColumns)
      .eq("shop_slug", shopSlug)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Supabase legacy approved shop_comments fetch failed.", error);
      return [];
    }

    return buildCommentTree(data ?? []);
  } catch (error) {
    console.error("Unexpected Supabase legacy approved shop_comments fetch failure.", error);
    return [];
  }
}

async function fetchRecentApprovedCommentsLegacy(limit: number): Promise<ShopComment[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("shop_comments")
      .select(legacyCommentSelectColumns)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase legacy recent shop_comments fetch failed.", error);
      return [];
    }

    return (data ?? []).map(mapCommentRow).filter(Boolean) as ShopComment[];
  } catch (error) {
    console.error("Unexpected Supabase legacy recent shop_comments fetch failure.", error);
    return [];
  }
}

function buildCommentTree(rows: SupabaseCommentRow[]): ShopComment[] {
  const comments = rows.map(mapCommentRow).filter(Boolean) as ShopComment[];
  const topLevel = comments
    .filter((comment) => !comment.parent_comment_id)
    .sort((a, b) => sortByDateDescending(a.created_at, b.created_at))
    .slice(0, 20);

  const topLevelIds = new Set(topLevel.map((comment) => comment.id));

  for (const comment of topLevel) {
    comment.replies = comments
      .filter((reply) => reply.parent_comment_id === comment.id && topLevelIds.has(reply.parent_comment_id))
      .sort((a, b) => sortByDateAscending(a.created_at, b.created_at));
  }

  return topLevel;
}

function mapCommentRow(row: SupabaseCommentRow): ShopComment | null {
  const id = readId(row, "id");
  const shopSlug = readString(row, "shop_slug");
  const shopName = readString(row, "shop_name");
  const commentText = readString(row, "comment_text");
  const category = readString(row, "category");
  const status = readString(row, "status");

  if (!id || !shopSlug || !shopName || !commentText || !category || status !== "approved") {
    return null;
  }

  return {
    id,
    shop_id: readId(row, "shop_id"),
    shop_slug: shopSlug,
    shop_name: shopName,
    parent_comment_id: readId(row, "parent_comment_id"),
    display_name: readString(row, "display_name"),
    comment_text: commentText,
    category,
    status: "approved",
    created_at: readString(row, "created_at"),
    updated_at: readString(row, "updated_at"),
    like_count: readInteger(row, "like_count"),
    visitor_has_liked: readBoolean(row, "visitor_has_liked"),
    replies: []
  };
}

function sortByDateDescending(a?: string, b?: string) {
  return getDateTime(b) - getDateTime(a);
}

function sortByDateAscending(a?: string, b?: string) {
  return getDateTime(a) - getDateTime(b);
}

function getDateTime(value?: string) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function readString(row: SupabaseCommentRow, key: string) {
  const value = row[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readId(row: SupabaseCommentRow, key: string) {
  const value = row[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function readInteger(row: SupabaseCommentRow, key: string) {
  const value = row[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);

    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  return 0;
}

function readBoolean(row: SupabaseCommentRow, key: string) {
  const value = row[key];

  return typeof value === "boolean" ? value : undefined;
}
