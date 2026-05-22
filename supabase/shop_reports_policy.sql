create table if not exists public.shop_reports (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  shop_slug text,
  incorrect_information text not null,
  correct_information text not null,
  reporter_email text,
  status text not null default 'pending',
  created_at timestamp with time zone not null default now(),
  constraint shop_reports_status_check check (status in ('pending', 'reviewed', 'approved', 'rejected'))
);

alter table public.shop_reports enable row level security;

revoke all on table public.shop_reports from public;
revoke all on table public.shop_reports from anon;
grant insert on table public.shop_reports to anon;

drop policy if exists "Public can submit pending shop reports" on public.shop_reports;
create policy "Public can submit pending shop reports"
on public.shop_reports
for insert
to anon
with check (status = 'pending');

-- Intentionally do not create a public SELECT policy for this table.
