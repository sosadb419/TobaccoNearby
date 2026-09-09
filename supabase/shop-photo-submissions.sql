-- Camera-only shop photo submissions for TobaccoNearby.
-- Run this manually in the Supabase SQL editor after review.
--
-- Public visitors can:
-- - upload a newly captured image to the private shop-photos bucket;
-- - insert a pending shop_photos row;
-- - read approved shop_photos rows;
-- - create signed URLs only for Storage objects connected to approved rows.
--
-- Public visitors cannot approve, update, delete, enumerate pending rows,
-- or read pending/rejected Storage objects through the normal public API.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'shop-photos',
  'shop-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

create table if not exists public.shop_photos (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid,
  shop_slug text not null,
  shop_name text,
  storage_path text not null unique,
  status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  display_name text,
  constraint shop_photos_status_check check (status in ('pending', 'approved', 'rejected')),
  constraint shop_photos_shop_slug_check check (char_length(shop_slug) between 1 and 160),
  constraint shop_photos_storage_path_check check (
    storage_path ~ '^submissions/[a-z0-9-]+/[a-zA-Z0-9-]+\.jpg$'
  )
);

create index if not exists shop_photos_shop_status_approved_idx
on public.shop_photos (shop_slug, status, approved_at desc, submitted_at desc);

create index if not exists shop_photos_status_idx
on public.shop_photos (status);

alter table public.shop_photos enable row level security;

revoke all on table public.shop_photos from public;
revoke all on table public.shop_photos from anon;

grant insert, select on table public.shop_photos to anon;

drop policy if exists "Public can submit pending shop photos" on public.shop_photos;
create policy "Public can submit pending shop photos"
on public.shop_photos
for insert
to anon
with check (
  status = 'pending'
  and approved_at is null
  and storage_path ~ '^submissions/[a-z0-9-]+/[a-zA-Z0-9-]+\.jpg$'
);

drop policy if exists "Public can view approved shop photos" on public.shop_photos;
create policy "Public can view approved shop photos"
on public.shop_photos
for select
to anon
using (status = 'approved');

-- No public UPDATE or DELETE policies are created for shop_photos.
-- Admin moderation should approve/reject rows outside the public website.

drop policy if exists "Public can upload pending shop photo objects" on storage.objects;
create policy "Public can upload pending shop photo objects"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'shop-photos'
  and name ~ '^submissions/[a-z0-9-]+/[a-zA-Z0-9-]+\.jpg$'
  and coalesce((metadata->>'mimetype'), 'image/jpeg') in ('image/jpeg', 'image/png', 'image/webp')
);

drop policy if exists "Public can read approved shop photo objects" on storage.objects;
create policy "Public can read approved shop photo objects"
on storage.objects
for select
to anon
using (
  bucket_id = 'shop-photos'
  and exists (
    select 1
    from public.shop_photos photo
    where photo.storage_path = storage.objects.name
      and photo.status = 'approved'
  )
);

-- No public UPDATE or DELETE policies are created for storage.objects.
-- Client uploads use upsert: false and unpredictable paths such as submissions/{shopSlug}/{uuid}.jpg.
