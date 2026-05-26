import { cache } from "react";
import type { ShopComment } from "@/data/comments";
import { supabase } from "@/lib/supabase";

type SupabaseCommentRow = Record<string, unknown>;

const commentSelectColumns =
  "id,shop_id,shop_slug,shop_name,display_name,comment_text,category,status,created_at,updated_at";

export const getApprovedCommentsForShop = cache(async (shopSlug: string): Promise<ShopComment[]> => {
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
      .limit(20);

    if (error) {
      console.error("Supabase approved shop_comments fetch failed.", error);
      return [];
    }

    return (data ?? []).map(mapCommentRow).filter(Boolean) as ShopComment[];
  } catch (error) {
    console.error("Unexpected Supabase approved shop_comments fetch failure.", error);
    return [];
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
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase recent shop_comments fetch failed.", error);
      return [];
    }

    return (data ?? []).map(mapCommentRow).filter(Boolean) as ShopComment[];
  } catch (error) {
    console.error("Unexpected Supabase recent shop_comments fetch failure.", error);
    return [];
  }
});

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
    display_name: readString(row, "display_name"),
    comment_text: commentText,
    category,
    status: "approved",
    created_at: readString(row, "created_at"),
    updated_at: readString(row, "updated_at")
  };
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
