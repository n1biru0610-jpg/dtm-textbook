-- デイリーチャレンジ（4小節）の作品置き場。Supabase の SQL Editor で1回だけ実行する。
-- 実行前提：スタッフ表 staff(user_id) がすでにある（スタッフ設定のSQLで作成済み）。
create table if not exists daily_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  day text not null check (day ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  theme text not null default '',
  nick text not null default '',
  ok int not null default 0,
  total int not null default 0,
  bpm int not null default 0,
  proj jsonb not null,
  user_id uuid default auth.uid()
);
create index if not exists daily_entries_day_idx on daily_entries (day, created_at desc);
alter table daily_entries enable row level security;
-- だれでも読める（みんなの作品一覧）
drop policy if exists "read daily entries" on daily_entries;
create policy "read daily entries" on daily_entries for select using (true);
-- だれでも出せる（ログインなしのゲストも）。大きすぎるデータ・おかしな数値は受けつけない
drop policy if exists "post daily entries" on daily_entries;
create policy "post daily entries" on daily_entries for insert with check (
  char_length(nick) <= 40 and char_length(theme) <= 60
  and ok >= 0 and total between 1 and 12 and ok <= total
  and pg_column_size(proj) < 100000
);
-- 不適切な作品は、スタッフだけが消せる
drop policy if exists "staff delete daily entries" on daily_entries;
create policy "staff delete daily entries" on daily_entries for delete using (
  exists (select 1 from staff s where s.user_id = auth.uid())
);
grant select, insert on daily_entries to anon, authenticated;
grant delete on daily_entries to authenticated;
