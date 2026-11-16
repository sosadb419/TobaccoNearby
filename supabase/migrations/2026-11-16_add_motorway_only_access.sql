-- Run this migration manually in Supabase before deploying the application code.
-- FALSE is intentionally the safe default: a listing must only be marked TRUE
-- after a location-specific access review confirms motorway-only access.

alter table public.shops
  add column if not exists motorway_only_access boolean not null default false;

grant select (motorway_only_access) on table public.shops to anon;

comment on column public.shops.motorway_only_access is
  'TRUE only when reviewed evidence confirms there is no lawful, practical pedestrian, bicycle or local-road access.';
