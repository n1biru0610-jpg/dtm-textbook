# 夜間テスト用の道具（preview/index.html 用）

作業用フォルダ（例：scratchpad/t）にコピーして、そのフォルダで実行する。

1. `node ext.js` … preview/index.html から DAW編の中身（DAW_HTML）を取り出して daw.html を作る
2. テスト用に内部をさわれるようにする：
   `python3 -c "s=open('daw.html',encoding='utf8').read();s=s.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){',1);open('dawt2.html','w',encoding='utf8').write(s)"`
3. `node walk.js D-1,D-2 [幅] [高さ] [t=タッチ]` … 実際のマウス操作（手のヒントの位置をクリック等）でレッスンを進める。
   - `NOT CONFIRMED` … その操作で進めなかった（自由入力のステップなど、道具が対応していないものもある）
   - `COVERED` … ハイライト対象の中心が吹き出しに隠れている
   - `finish=true` … クリア画面まで到達
   - スクショ shot_<ID>_<ステップ>.png を出力
4. `node page.js` … preview/index.html 全体を開いてページエラーを確認（Supabase等の通信は遮断）
5. `node chord.js [幅] [高さ] [t]` … D-17/D-18 のコードボタン操作を実操作で確認
