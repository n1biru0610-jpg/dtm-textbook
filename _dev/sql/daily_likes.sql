-- デイリー作品へのスタンプ（いいね）。Supabase の SQL Editor で1回だけ実行する。
-- 前提：daily_entries がすでにある。スタンプはログインした人だけが押せる（1つの作品に、スタンプの種類ごと1回）。
create table if not exists daily_likes (
  entry_id uuid not null references daily_entries(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  stamp smallint not null check (stamp between 0 and 3),
  created_at timestamptz not null default now(),
  primary key (entry_id, user_id, stamp)
);
alter table daily_likes enable row level security;
drop policy if exists "read daily likes" on daily_likes;
create policy "read daily likes" on daily_likes for select using (true);
drop policy if exists "add own like" on daily_likes;
create policy "add own like" on daily_likes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "remove own like" on daily_likes;
create policy "remove own like" on daily_likes for delete to authenticated using (user_id = auth.uid());
grant select on daily_likes to anon, authenticated;
grant insert, delete on daily_likes to authenticated;
