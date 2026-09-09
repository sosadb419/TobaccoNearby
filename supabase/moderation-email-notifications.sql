-- Moderation email notification support for TobaccoNearby.
-- Run this manually in the Supabase SQL editor after review.
--
-- This table prevents duplicate notification emails when Supabase webhooks retry.
-- The Next.js webhook endpoint claims one notification_key before sending email.

create table if not exists public.moderation_notifications (
  id uuid primary key default gen_random_uuid(),
  notification_key text not null unique,
  source_table text not null,
  source_id uuid not null,
  submission_type text not null,
  claimed_at timestamptz not null default now(),
  notified_at timestamptz,
  constraint moderation_notifications_source_table_check check (source_table in ('shop_comments', 'shop_photos')),
  constraint moderation_notifications_submission_type_check check (
    submission_type in ('Community Note', 'Reply', 'Photo')
  )
);

create index if not exists moderation_notifications_source_idx
on public.moderation_notifications (source_table, source_id);

create index if not exists moderation_notifications_notified_at_idx
on public.moderation_notifications (notified_at);

alter table public.moderation_notifications enable row level security;

revoke all on table public.moderation_notifications from public;
revoke all on table public.moderation_notifications from anon;

-- Do not add public policies for this table.
-- It is written by the protected Next.js webhook using SUPABASE_SERVICE_ROLE_KEY.

-- Supabase Database Webhook setup:
-- 1. Create one webhook on public.shop_comments for INSERT events.
-- 2. Create one webhook on public.shop_photos for INSERT events.
-- 3. Method: POST.
-- 4. URL: https://YOUR_DOMAIN/api/moderation-webhook
-- 5. Header:
--    x-moderation-webhook-secret: <your MODERATION_WEBHOOK_SECRET value>
-- 6. The API route enforces status = 'pending', so non-pending rows are ignored.
-- 7. Do not include service-role keys or email credentials in webhook headers.
