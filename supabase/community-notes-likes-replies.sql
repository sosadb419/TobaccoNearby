-- Community Notes replies and likes.
-- Run this in the Supabase SQL editor. It preserves moderation:
-- public visitors can submit pending notes/replies, read approved notes/replies,
-- and like/unlike approved top-level notes through narrow RPC functions.

alter table public.shop_comments
add column if not exists parent_comment_id uuid references public.shop_comments(id) on delete cascade;

alter table public.shop_comments
drop constraint if exists shop_comments_comment_length_check;

alter table public.shop_comments
add constraint shop_comments_comment_length_check
check (
  (
    parent_comment_id is null
    and char_length(comment_text) between 10 and 800
  )
  or (
    parent_comment_id is not null
    and char_length(comment_text) between 5 and 500
  )
);

create index if not exists shop_comments_shop_status_parent_created_idx
on public.shop_comments (shop_slug, status, parent_comment_id, created_at);

create table if not exists public.shop_comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.shop_comments(id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  constraint shop_comment_likes_visitor_id_length_check check (char_length(visitor_id) between 20 and 100),
  constraint shop_comment_likes_unique_visitor_comment unique (comment_id, visitor_id)
);

create index if not exists shop_comment_likes_comment_id_idx
on public.shop_comment_likes (comment_id);

alter table public.shop_comments enable row level security;
alter table public.shop_comment_likes enable row level security;

revoke all on table public.shop_comments from public;
revoke all on table public.shop_comments from anon;
revoke all on table public.shop_comment_likes from public;
revoke all on table public.shop_comment_likes from anon;

grant insert, select on table public.shop_comments to anon;

drop policy if exists "Public can submit pending shop comments" on public.shop_comments;
create policy "Public can submit pending shop comments"
on public.shop_comments
for insert
to anon
with check (
  status = 'pending'
  and (
    (
      parent_comment_id is null
      and char_length(comment_text) between 10 and 800
      and category in ('Opening hours', 'Accessibility', 'Directions', 'Contact information', 'General note')
    )
    or (
      parent_comment_id is not null
      and char_length(comment_text) between 5 and 500
      and exists (
        select 1
        from public.shop_comments parent
        where parent.id = parent_comment_id
          and parent.status = 'approved'
          and parent.parent_comment_id is null
          and parent.shop_slug = shop_slug
      )
    )
  )
);

drop policy if exists "Public can view approved shop comments" on public.shop_comments;
create policy "Public can view approved shop comments"
on public.shop_comments
for select
to anon
using (status = 'approved');

create or replace function public.get_approved_shop_comments(
  target_shop_slug text,
  top_level_limit integer default 20
)
returns table (
  id uuid,
  shop_id text,
  shop_slug text,
  shop_name text,
  parent_comment_id uuid,
  display_name text,
  comment_text text,
  category text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  like_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with approved_top_level as (
    select c.id
    from public.shop_comments c
    where c.shop_slug = target_shop_slug
      and c.status = 'approved'
      and c.parent_comment_id is null
    order by c.created_at desc
    limit greatest(1, least(coalesce(top_level_limit, 20), 50))
  ),
  approved_thread as (
    select c.*
    from public.shop_comments c
    join approved_top_level top_level on top_level.id = c.id

    union all

    select reply.*
    from public.shop_comments reply
    join approved_top_level top_level on top_level.id = reply.parent_comment_id
    where reply.status = 'approved'
  )
  select
    c.id,
    c.shop_id,
    c.shop_slug,
    c.shop_name,
    c.parent_comment_id,
    c.display_name,
    c.comment_text,
    c.category,
    c.status,
    c.created_at,
    c.updated_at,
    coalesce(count(l.id), 0) as like_count
  from approved_thread c
  left join public.shop_comment_likes l
    on l.comment_id = c.id
    and c.parent_comment_id is null
  group by
    c.id,
    c.shop_id,
    c.shop_slug,
    c.shop_name,
    c.parent_comment_id,
    c.display_name,
    c.comment_text,
    c.category,
    c.status,
    c.created_at,
    c.updated_at
  order by
    c.parent_comment_id nulls first,
    c.created_at desc;
$$;

create or replace function public.get_liked_shop_comment_ids(
  target_comment_ids uuid[],
  target_visitor_id text
)
returns table (comment_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select l.comment_id
  from public.shop_comment_likes l
  join public.shop_comments c on c.id = l.comment_id
  where l.comment_id = any(target_comment_ids)
    and l.visitor_id = target_visitor_id
    and c.status = 'approved'
    and c.parent_comment_id is null;
$$;

create or replace function public.like_shop_comment(
  target_comment_id uuid,
  target_visitor_id text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_like_count integer;
begin
  if target_visitor_id is null or char_length(target_visitor_id) not between 20 and 100 then
    raise exception 'Invalid visitor id';
  end if;

  if not exists (
    select 1
    from public.shop_comments c
    where c.id = target_comment_id
      and c.status = 'approved'
      and c.parent_comment_id is null
  ) then
    raise exception 'Comment is not available for likes';
  end if;

  insert into public.shop_comment_likes (comment_id, visitor_id)
  values (target_comment_id, target_visitor_id)
  on conflict (comment_id, visitor_id) do nothing;

  select count(*)::integer
  into current_like_count
  from public.shop_comment_likes
  where comment_id = target_comment_id;

  return current_like_count;
end;
$$;

create or replace function public.unlike_shop_comment(
  target_comment_id uuid,
  target_visitor_id text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_like_count integer;
begin
  if target_visitor_id is null or char_length(target_visitor_id) not between 20 and 100 then
    raise exception 'Invalid visitor id';
  end if;

  delete from public.shop_comment_likes
  where comment_id = target_comment_id
    and visitor_id = target_visitor_id
    and exists (
      select 1
      from public.shop_comments c
      where c.id = target_comment_id
        and c.status = 'approved'
        and c.parent_comment_id is null
    );

  select count(*)::integer
  into current_like_count
  from public.shop_comment_likes
  where comment_id = target_comment_id;

  return current_like_count;
end;
$$;

revoke all on function public.get_approved_shop_comments(text, integer) from public;
revoke all on function public.get_liked_shop_comment_ids(uuid[], text) from public;
revoke all on function public.like_shop_comment(uuid, text) from public;
revoke all on function public.unlike_shop_comment(uuid, text) from public;

grant execute on function public.get_approved_shop_comments(text, integer) to anon;
grant execute on function public.get_liked_shop_comment_ids(uuid[], text) to anon;
grant execute on function public.like_shop_comment(uuid, text) to anon;
grant execute on function public.unlike_shop_comment(uuid, text) to anon;

-- Do not add anon SELECT, UPDATE, or DELETE grants on public.shop_comment_likes.
-- Moderation remains outside the public website: pending/rejected comments are not publicly readable.
