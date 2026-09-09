import { cache } from "react";
import type { ShopPhoto } from "@/data/photos";
import { supabase } from "@/lib/supabase";

type SupabasePhotoRow = Record<string, unknown>;

const photoSelectColumns =
  "id,shop_id,shop_slug,storage_path,status,submitted_at,approved_at,display_name";

const shopPhotosBucket = "shop-photos";

export const getApprovedPhotosForShop = cache(async (shopSlug: string): Promise<ShopPhoto[]> => {
  if (!supabase) {
    return [];
  }

  const client = supabase;

  try {
    const { data, error } = await client
      .from("shop_photos")
      .select(photoSelectColumns)
      .eq("shop_slug", shopSlug)
      .eq("status", "approved")
      .order("approved_at", { ascending: false, nullsFirst: false })
      .order("submitted_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Supabase approved shop_photos fetch failed.", error);
      return [];
    }

    const photos = (data ?? []).map(mapPhotoRow).filter(Boolean) as Omit<ShopPhoto, "signed_url">[];
    const signedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const { data: signedData, error: signedError } = await client.storage
          .from(shopPhotosBucket)
          .createSignedUrl(photo.storage_path, 60 * 60);

        if (signedError || !signedData?.signedUrl) {
          console.error("Supabase shop photo signed URL creation failed.", signedError);
          return null;
        }

        return {
          ...photo,
          signed_url: signedData.signedUrl
        };
      })
    );

    return signedPhotos.filter(Boolean) as ShopPhoto[];
  } catch (error) {
    console.error("Unexpected Supabase approved shop_photos fetch failure.", error);
    return [];
  }
});

function mapPhotoRow(row: SupabasePhotoRow): Omit<ShopPhoto, "signed_url"> | null {
  const id = readId(row, "id");
  const shopSlug = readString(row, "shop_slug");
  const storagePath = readString(row, "storage_path");
  const status = readString(row, "status");

  if (!id || !shopSlug || !storagePath || status !== "approved") {
    return null;
  }

  return {
    id,
    shop_id: readId(row, "shop_id"),
    shop_slug: shopSlug,
    storage_path: storagePath,
    status: "approved",
    submitted_at: readString(row, "submitted_at"),
    approved_at: readString(row, "approved_at"),
    display_name: readString(row, "display_name")
  };
}

function readString(row: SupabasePhotoRow, key: string) {
  const value = row[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readId(row: SupabasePhotoRow, key: string) {
  const value = row[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}
