-- THE CLIMB — Supabase setup
-- Paste all of this into Supabase: SQL Editor → New query → Run. Run it once.
--
-- One table, one row per signed-in person, holding that person's progress.
-- Row Level Security means the database itself checks every request: you can
-- only read or change your own row, and someone who isn't signed in gets nothing.

create table if not exists public.progress (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Signed-in people may read, add and change their own row. Nobody may delete
-- it through the app, and people who aren't signed in may do nothing at all.
revoke all on public.progress from anon;
grant select, insert, update on public.progress to authenticated;

drop policy if exists "Read my own progress" on public.progress;
create policy "Read my own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Add my own progress" on public.progress;
create policy "Add my own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Change my own progress" on public.progress;
create policy "Change my own progress" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Live updates: a change on your phone shows up on your laptop straight away.
-- (The same rules apply: each device only hears about its own person's row.)
do $$
begin
  alter publication supabase_realtime add table public.progress;
exception when duplicate_object then null;
end $$;

-- Keep-awake: GitHub calls this every few days so the free project doesn't
-- pause. It touches no data; it only answers 1.
create or replace function public.keep_alive() returns integer
  language sql stable set search_path = '' as $$ select 1 $$;
grant execute on function public.keep_alive() to anon;
