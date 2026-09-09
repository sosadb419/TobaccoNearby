import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import {
  addPhotoPreviewUrl,
  buildEmailHtml,
  buildEmailText,
  buildModerationItemFromWebhook,
  claimModerationNotification,
  getModerationEmailSubject,
  markModerationNotificationSent,
  type ModerationWebhookPayload
} from "@/lib/moderation-notifications";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ModerationWebhookPayload;

  try {
    payload = (await request.json()) as ModerationWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const item = buildModerationItemFromWebhook(payload);

  if (!item) {
    return NextResponse.json({ skipped: true, reason: "No pending moderation item in payload" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const moderationEmail = process.env.MODERATION_EMAIL;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey || !moderationEmail || !emailFrom) {
    console.error("Moderation email env vars are missing.");
    return NextResponse.json({ error: "Email notification is not configured" }, { status: 500 });
  }

  const wasClaimed = await claimModerationNotification(item);

  if (!wasClaimed) {
    return NextResponse.json({ skipped: true, reason: "Notification already claimed" });
  }

  const emailItem = item.sourceTable === "shop_photos" ? await addPhotoPreviewUrl(item) : item;
  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: emailFrom,
    to: moderationEmail,
    subject: getModerationEmailSubject(emailItem),
    text: buildEmailText(emailItem),
    html: buildEmailHtml(emailItem)
  });

  if (error) {
    console.error("Resend moderation email failed.", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 502 });
  }

  await markModerationNotificationSent(item);

  return NextResponse.json({ ok: true });
}

function isAuthorizedWebhook(request: NextRequest) {
  const expectedSecret = process.env.MODERATION_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error("MODERATION_WEBHOOK_SECRET is not configured.");
    return false;
  }

  const headerSecret =
    request.headers.get("x-moderation-webhook-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return Boolean(headerSecret && headerSecret === expectedSecret);
}
