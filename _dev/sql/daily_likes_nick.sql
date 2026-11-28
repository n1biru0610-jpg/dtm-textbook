-- スタンプを押した人の名前（通知に「○○さんから」と出すため）。daily_likes.sql のあとに1回だけ実行する。
alter table daily_likes add column if not exists nick text not null default '' check (char_length(nick) <= 40);
