create table if not exists public.shop_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null,
  shop_name text not null,
  address text,
  city text not null default 'Amsterdam',
  neighborhood text,
  opening_hours text,
  phone text,
  website text,
  google_maps_url text,
  requested_change text not null,
  source_or_reason text,
  submitter_email text,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now(),
  constraint shop_submissions_type_check check (
    submission_type in ('Add a new shop', 'Update an existing shop', 'Request removal')
  ),
  constraint shop_submissions_status_check check (status in ('pending', 'reviewed', 'approved', 'rejected')),
  constraint shop_submissions_address_required_check check (
    submission_type = 'Request removal' or nullif(btrim(address), '') is not null
  )
);

alter table public.shop_submissions enable row level security;

revoke all on table public.shop_submissions from public;
revoke all on table public.shop_submissions from anon;
grant insert on table public.shop_submissions to anon;

drop policy if exists "Public can submit pending shop submissions" on public.shop_submissions;
create policy "Public can submit pending shop submissions"
on public.shop_submissions
for insert
to anon
with check (
  status = 'pending'
  and submission_type in ('Add a new shop', 'Update an existing shop', 'Request removal')
  and (submission_type = 'Request removal' or nullif(btrim(address), '') is not null)
);

-- Intentionally do not create a public SELECT policy for this table.
