-- 称号（バッジ）を、みんなの作品に表示するための追加。Supabase の SQL Editor で1回だけ実行する。
-- （実行前でもアプリは動く：称号なしで投稿・表示される）
alter table daily_entries add column if not exists badge text not null default '';
drop policy if exists "post daily entries" on daily_entries;
create policy "post daily entries" on daily_entries for insert with check (
  char_length(nick) <= 40 and char_length(theme) <= 60 and char_length(badge) <= 30
  and ok >= 0 and total between 1 and 12 and ok <= total
  and pg_column_size(proj) < 100000
);
