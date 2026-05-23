-- Run this in Supabase to keep internal shop workflow fields out of public API reads.
-- Admin operations should use a separately protected role or server-side workflow.

alter table public.shops enable row level security;

-- Public read policies combine with OR logic. Remove prior broad public/anon
-- read policies before applying the publication visibility rule below.
do $$
declare
  public_read_policy record;
begin
  for public_read_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'shops'
      and cmd in ('SELECT', 'ALL')
      and (
        roles @> array['anon']::name[]
        or roles @> array['public']::name[]
      )
  loop
    execute format('drop policy if exists %I on public.shops', public_read_policy.policyname);
  end loop;
end
$$;

drop policy if exists "Public can view published shops" on public.shops;
create policy "Public can view published shops"
on public.shops
for select
to anon
using (status = 'published');

revoke all on table public.shops from public;
revoke all on table public.shops from anon;

grant select (
  id,
  name,
  slug,
  address,
  postal_code,
  city,
  country,
  latitude,
  longitude,
  neighborhood,
  opening_hours,
  phone,
  website,
  google_maps_url,
  wheelchair_accessible,
  public_transport_info,
  last_updated,
  status,
  verified,
  last_checked_at,
  created_at,
  updated_at
) on table public.shops to anon;

-- source_url and internal_notes intentionally receive no public SELECT grant.
-- No public INSERT, UPDATE or DELETE privileges are granted on shops.
