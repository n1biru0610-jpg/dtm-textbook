-- 「先生に曲を聴いてもらう」用の表。Supabase の SQL Editor で1回だけ実行する。
-- 実行前提：スタッフ表 staff(user_id) がすでにある（スタッフ設定のSQLで作成済み）。
create table if not exists teacher_songs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid(),
  nick text not null default '',
  title text not null default '',
  msg text not null default '',
  bpm int not null default 0,
  proj jsonb not null,
  reply text not null default '',
  stamp text not null default '',
  replied_at timestamptz
);
create index if not exists teacher_songs_user_idx on teacher_songs (user_id, created_at desc);
create index if not exists teacher_songs_new_idx on teacher_songs (created_at desc);
alter table teacher_songs enable row level security;
-- 読める人：送った本人 と スタッフ
drop policy if exists "read own or staff teacher songs" on teacher_songs;
create policy "read own or staff teacher songs" on teacher_songs for select using (
  user_id = auth.uid() or exists (select 1 from staff s where s.user_id = auth.uid()));
-- 送れる人：ログイン中のアカウントだけ（ゲストは送れない）。大きすぎる・長すぎるものは受けつけない。
drop policy if exists "post own teacher songs" on teacher_songs;
create policy "post own teacher songs" on teacher_songs for insert with check (
  user_id = auth.uid() and auth.uid() is not null
  and char_length(nick) <= 40 and char_length(title) <= 40 and char_length(msg) <= 200
  and reply = '' and stamp = '' and replied_at is null
  and pg_column_size(proj) < 300000);
-- 返事を書けるのはスタッフだけ
drop policy if exists "staff reply teacher songs" on teacher_songs;
create policy "staff reply teacher songs" on teacher_songs for update
  using (exists (select 1 from staff s where s.user_id = auth.uid()))
  with check (exists (select 1 from staff s where s.user_id = auth.uid()) and char_length(reply) <= 300 and char_length(stamp) <= 8);
-- 消せる人：送った本人（とりけし）と スタッフ
drop policy if exists "delete own or staff teacher songs" on teacher_songs;
create policy "delete own or staff teacher songs" on teacher_songs for delete using (
  user_id = auth.uid() or exists (select 1 from staff s where s.user_id = auth.uid()));
grant select, insert, update, delete on teacher_songs to authenticated;
