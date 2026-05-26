create table if not exists public.shop_comments (
  id uuid primary key default gen_random_uuid(),
  shop_id text,
  shop_slug text not null,
  shop_name text not null,
  display_name text,
  comment_text text not null,
  category text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shop_comments_status_check check (status in ('pending', 'approved', 'rejected')),
  constraint shop_comments_category_check check (
    category in ('Opening hours', 'Accessibility', 'Directions', 'Contact information', 'General note')
  ),
  constraint shop_comments_comment_length_check check (char_length(comment_text) between 10 and 800)
);

alter table public.shop_comments enable row level security;

revoke all on table public.shop_comments from public;
revoke all on table public.shop_comments from anon;

grant insert, select on table public.shop_comments to anon;

drop policy if exists "Public can submit pending shop comments" on public.shop_comments;
create policy "Public can submit pending shop comments"
on public.shop_comments
for insert
to anon
with check (
  status = 'pending'
  and char_length(comment_text) between 10 and 800
  and category in ('Opening hours', 'Accessibility', 'Directions', 'Contact information', 'General note')
);

drop policy if exists "Public can view approved shop comments" on public.shop_comments;
create policy "Public can view approved shop comments"
on public.shop_comments
for select
to anon
using (status = 'approved');

-- Intentionally do not create public UPDATE or DELETE policies for this table.
-- Pending and rejected comments remain hidden from public SELECT by row level security.
