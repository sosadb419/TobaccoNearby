import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SITE_URL } from "@/lib/site-config";

type ModerationRecord = Record<string, unknown>;

export type ModerationItem = {
  id: string;
  sourceTable: "shop_comments" | "shop_photos";
  type: "Community Note" | "Reply" | "Photo";
  shopName: string;
  shopSlug: string;
  displayName?: string;
  category?: string;
  text?: string;
  parentCommentId?: string;
  storagePath?: string;
  submittedAt?: string;
  previewUrl?: string;
};

export type ModerationWebhookPayload = {
  table?: string;
  record?: ModerationRecord;
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "");
const photoBucketName = "shop-photos";

export function getModerationReviewUrl(item?: Pick<ModerationItem, "sourceTable" | "id">) {
  const url = new URL("/admin/moderation", siteUrl);

  if (item) {
    url.searchParams.set("type", item.sourceTable === "shop_comments" ? "comment" : "photo");
    url.searchParams.set("id", item.id);
  }

  return url.toString();
}

export function getModerationEmailSubject(item: ModerationItem) {
  const typeLabel = item.type === "Community Note" ? "note" : item.type.toLowerCase();

  return `[TobaccoNearby] New ${typeLabel} awaiting review - ${item.shopName}`;
}

export function buildModerationItemFromWebhook(payload: ModerationWebhookPayload): ModerationItem | null {
  const table = readString(payload, "table");
  const record = payload.record;

  if (!record || readString(record, "status") !== "pending") {
    return null;
  }

  if (table === "shop_comments") {
    return buildCommentItem(record);
  }

  if (table === "shop_photos") {
    return buildPhotoItem(record);
  }

  return null;
}

export async function getPendingModerationItems(limit = 50): Promise<ModerationItem[]> {
  if (!supabaseAdmin) {
    return [];
  }

  const [commentsResult, photosResult] = await Promise.all([
    supabaseAdmin
      .from("shop_comments")
      .select("id,shop_id,shop_slug,shop_name,parent_comment_id,display_name,comment_text,category,status,created_at,updated_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabaseAdmin
      .from("shop_photos")
      .select("id,shop_id,shop_slug,shop_name,storage_path,status,submitted_at,approved_at,display_name")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false })
      .limit(limit)
  ]);

  if (commentsResult.error) {
    console.error("Supabase pending shop_comments admin fetch failed.", commentsResult.error);
  }

  if (photosResult.error) {
    console.error("Supabase pending shop_photos admin fetch failed.", photosResult.error);
  }

  const commentItems = (commentsResult.data ?? []).map(buildCommentItem).filter(Boolean) as ModerationItem[];
  const photoItems = await Promise.all(
    ((photosResult.data ?? []).map(buildPhotoItem).filter(Boolean) as ModerationItem[]).map(addPhotoPreviewUrl)
  );

  return [...commentItems, ...photoItems]
    .sort((a, b) => getDateTime(b.submittedAt) - getDateTime(a.submittedAt))
    .slice(0, limit);
}

export async function addPhotoPreviewUrl(item: ModerationItem): Promise<ModerationItem> {
  if (!supabaseAdmin || item.sourceTable !== "shop_photos" || !item.storagePath) {
    return item;
  }

  const { data, error } = await supabaseAdmin.storage
    .from(photoBucketName)
    .createSignedUrl(item.storagePath, 60 * 30);

  if (error || !data?.signedUrl) {
    console.error("Supabase moderation photo preview signed URL failed.", error);
    return item;
  }

  return {
    ...item,
    previewUrl: data.signedUrl
  };
}

export async function claimModerationNotification(item: ModerationItem) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const notificationKey = getNotificationKey(item);
  const { error } = await supabaseAdmin.from("moderation_notifications").insert({
    notification_key: notificationKey,
    source_table: item.sourceTable,
    source_id: item.id,
    submission_type: item.type
  });

  if (!error) {
    return true;
  }

  if (error.code === "23505") {
    return false;
  }

  console.error("Supabase moderation notification claim failed.", error);
  throw new Error("Could not claim moderation notification.");
}

export async function markModerationNotificationSent(item: ModerationItem) {
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("moderation_notifications")
    .update({ notified_at: new Date().toISOString() })
    .eq("notification_key", getNotificationKey(item));

  if (error) {
    console.error("Supabase moderation notification sent marker failed.", error);
  }
}

export function buildEmailText(item: ModerationItem) {
  const lines = [
    "TobaccoNearby",
    `New ${item.type} awaiting review`,
    "",
    `Shop: ${item.shopName}`,
    `Shop slug: ${item.shopSlug}`,
    `Type: ${item.type}`
  ];

  if (item.displayName) {
    lines.push(`Name: ${item.displayName}`);
  } else if (item.type !== "Photo") {
    lines.push("Name: Anonymous");
  }

  if (item.category) {
    lines.push(`Category: ${item.category}`);
  }

  if (item.text) {
    lines.push("", item.text);
  }

  if (item.parentCommentId) {
    lines.push("", `Parent comment ID: ${item.parentCommentId}`);
  }

  if (item.storagePath) {
    lines.push("", `Storage path: ${item.storagePath}`);
  }

  if (item.previewUrl) {
    lines.push(`Signed preview URL: ${item.previewUrl}`);
  }

  lines.push("", `Submitted: ${formatDateTime(item.submittedAt)}`, "", `Review submission: ${getModerationReviewUrl(item)}`);

  return lines.join("\n");
}

export function buildEmailHtml(item: ModerationItem) {
  const rows = [
    ["Shop", item.shopName],
    ["Shop slug", item.shopSlug],
    ["Type", item.type],
    item.displayName || item.type !== "Photo" ? ["Name", item.displayName || "Anonymous"] : null,
    item.category ? ["Category", item.category] : null,
    item.parentCommentId ? ["Parent comment ID", item.parentCommentId] : null,
    item.storagePath ? ["Storage path", item.storagePath] : null,
    ["Submitted", formatDateTime(item.submittedAt)]
  ].filter(Boolean) as string[][];

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f5f2;color:#1f2428;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #dedbd2;border-radius:12px;padding:24px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f766e;">TobaccoNearby</p>
        <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;color:#1f2428;">New ${escapeHtml(
          item.type
        )} awaiting review</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
          ${rows
            .map(
              ([label, value]) => `<tr>
                <td style="width:145px;padding:7px 0;color:#687076;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
                <td style="padding:7px 0;color:#1f2428;vertical-align:top;">${escapeHtml(value)}</td>
              </tr>`
            )
            .join("")}
        </table>
        ${
          item.text
            ? `<div style="margin-top:18px;padding:14px;border-radius:10px;background:#f6f5f2;color:#1f2428;font-size:14px;line-height:1.6;">${escapeHtml(
                item.text
              )}</div>`
            : ""
        }
        ${
          item.previewUrl
            ? `<p style="margin:18px 0 0;font-size:14px;"><a href="${escapeHtml(
                item.previewUrl
              )}" style="color:#0f766e;font-weight:700;">Open short-lived photo preview</a></p>`
            : ""
        }
        <p style="margin:22px 0 0;">
          <a href="${escapeHtml(
            getModerationReviewUrl(item)
          )}" style="display:inline-block;background:#1f2428;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 16px;font-size:14px;font-weight:700;">Review submission</a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}

function buildCommentItem(record: ModerationRecord): ModerationItem | null {
  const id = readId(record, "id");
  const shopSlug = readString(record, "shop_slug");
  const shopName = readString(record, "shop_name") ?? shopSlug;
  const text = readString(record, "comment_text");

  if (!id || !shopSlug || !shopName || !text) {
    return null;
  }

  const parentCommentId = readId(record, "parent_comment_id");

  return {
    id,
    sourceTable: "shop_comments",
    type: parentCommentId ? "Reply" : "Community Note",
    shopName,
    shopSlug,
    displayName: readString(record, "display_name"),
    category: readString(record, "category"),
    text,
    parentCommentId,
    submittedAt: readString(record, "created_at") ?? readString(record, "updated_at")
  };
}

function buildPhotoItem(record: ModerationRecord): ModerationItem | null {
  const id = readId(record, "id");
  const shopSlug = readString(record, "shop_slug");
  const storagePath = readString(record, "storage_path");

  if (!id || !shopSlug || !storagePath) {
    return null;
  }

  return {
    id,
    sourceTable: "shop_photos",
    type: "Photo",
    shopName: readString(record, "shop_name") ?? shopSlug,
    shopSlug,
    displayName: readString(record, "display_name"),
    storagePath,
    submittedAt: readString(record, "submitted_at")
  };
}

function getNotificationKey(item: ModerationItem) {
  return `${item.sourceTable}:${item.id}`;
}

function readString(row: ModerationRecord, key: string) {
  const value = row[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readId(row: ModerationRecord, key: string) {
  const value = row[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function getDateTime(value?: string) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
