# ステップ7 報酬素材の設計メモ（6回目・下調べ）

まだ本番には何も入れていない。次の回はこのメモを元に、`_dev/zukan/cards.js` の `ZKPK` に足していく。
（ドラムでスウィングを使いたいので、**ステップ8（スウィング）を先にやる**案。PROGRESS.md 参照）

## MIDIカード30枚の中身（案）
すべて C メジャー（またはその平行調 Am）で作り、DAW側で移調できるようにする（キーを変えても使える）。
音の高さは MIDI 番号。コードは「左手ルート＋右手3〜4声」。トップノートがなるべく2度以内で動くように転回形を選ぶ。

### コード進行 10枚
| ID案 | 名前 | 進行（C） | 右手ボイシングのねらい |
|---|---|---|---|
| p-oudou | 王道進行 4536 | FM7-G7-Em7-Am7 | トップの動きは実際に書いてから確かめる。J-POPの定番 |
| p-marusa | 丸サ進行（Just the two of us 進行） | FM7-E7-Am7-Gm7 C7 | E7 で G#、C7 で Bb。4小節めは2拍ずつ |
| p-canon | カノン進行 | C-G/B-Am-Em/G-F-C/E-F/G-C | ベースが1音ずつ下がる（転回形で） |
| p-komuro | 小室進行 6451 | Am-F-G-C | トップを C か E にとどめる |
| p-1645 | 1645（50年代） | C-Am-F-G | ドゥーワップ。三和音のまま |
| p-2516 | ツーファイブ 2516 | Dm7-G7-CM7-A7 | ガイドトーン（3度と7度）がなめらかに入れかわる |
| p-1625 | 循環（イチロクニーゴー） | CM7-Am7-Dm7-G7 | ジャズ・シティポップの基本。ガイドトーン |
| p-1563 | 1563 | C-G-Am-Em-F-C-F-G | カノンの簡易版 |
| p-4561 | 4561（王道の解決版） | F-G-Am-C … F-G-C | おわる感じを作る |
| p-minor | マイナーの4つ | Am-Dm-E7-Am | E7 で G#（和声的短音階）。悲しい曲の基本 |

### メロディライン 8枚
コード進行カードの上で鳴らせる2〜4小節。ペンタ（ド・レ・ミ・ソ・ラ）中心、強拍はコードの音、さいごは主音か3度で終わる。問い→答えの形を最低2枚。

### ドラムパターン 8枚（2小節・16分グリッド・ベロシティ付き）
| 名前 | テンポ目安 | キック | スネア | ハット | 強弱・ノリ |
|---|---|---|---|---|---|
| 8ビート | 90〜120 | 1・3拍（3拍は「と」にずらす版も） | 2・4拍 | 8分 | 表拍 100・裏拍 70 |
| 4つ打ち | 120〜128 | 毎拍 | 2・4拍（クラップ） | 裏拍のオープン | ハット裏 90 |
| ハーフタイム | 70〜90（感じ）| 1拍 | 3拍のみ | 8分 | ゆったり |
| DnB 2ステップ | 170〜175 | 1拍・3拍の「と」 | 2・4拍 | 8分 | ゴーストスネア 30〜45 を16分の裏に |
| UKガレージ 2ステップ | 130〜135 | 1拍・3拍の16分うしろ（ずらし） | 2・4拍 | 16分 | **スウィング約60%**（ステップ8の機能で）、ハット強弱 |
| ヒップホップ（ブーンバップ） | 85〜95 | 1拍・2拍の「と」・3拍の16分うしろ | 2・4拍 | 8分 | スウィング 55%前後 |
| シャッフル | 100前後 | 1・3拍 | 2・4拍 | 3連の1つめと3つめ | ブルース・ロック |
| レゲエ（ワンドロップ） | 75 | 3拍 | 3拍（リム） | 8分 | 1拍めは鳴らさない |

### ベースライン 4枚
ルート弾き（8分）／オクターブ（8分で下上）／シンコペーション（3+3+2）／経過音つき（次のコードへ半音・全音でつなぐ）。

## 音源10・スキン10・称号5・着せ替え20
- 音源：今ある3つ（オルゴール・森の木琴・8ビット）＋7つ。音源機能の実装はまだなので、図鑑に「入手のタイミング（条件）」だけ登録する。
- スキン・着せ替え：画像生成の道具がこの作業環境にないため、**SVG（コードで描く絵）**で図鑑のファンタジー風にそろえて作る予定。仮素材で数だけ埋めない。
- 称号：名前と入手条件をセットで5つ。

## 参考にしたページ（6回目）
- [Royal road progression（Wikipedia）](https://www.wikipedia.org/wiki/Royal_road_progression)
- [王道進行（UTATEN）](https://utaten.com/live/royal-road-progression/)
- [王道進行（music-tech-box）](https://scrapbox.io/music-tech-box/王道進行)
- [How to make a UK garage beat（MusicRadar）](https://musicradar.com/how-to/uk-garage-tutorial)
- [UK Garage Beat Dissected（Attack Magazine）](https://www.attackmagazine.com/technique/beat-dissected/uk-garage/)
- [How to Program UK Garage Drums（The Producer School）](https://theproducerschool.com/blogs/featured-blogs/how-to-program-uk-garage-drums-complete-guide-for-producers)
- [2-step garage（Wikipedia）](https://en.wikipedia.org/wiki/2-step_garage)
- [How to add swing in Logic Pro and Ableton Live（MusicRadar）](https://musicradar.com/how-to/how-to-add-swing-to-your-beats-in-logic-pro-and-ableton-live)
- [6 different jungle and DnB grooves（MusicRadar）](https://www.musicradar.com/how-to/how-to-program-6-different-jungle-and-drum-n-bass-grooves)
- [How To Make Drum & Bass（EDMProd）](https://www.edmprod.com/how-to-make-drum-and-bass/)
- [Ghost notes（MusicRadar）](https://musicradar.com/tuition/tech/how-to-add-groove-and-pace-to-a-beat-using-ghost-notes-625526)
- [6 four to the floor grooves（MusicRadar）](https://www.musicradar.com/how-to/how-to-program-6-different-four-to-the-floor-grooves)
※ページの中身はまだ読み込んでいない（検索結果の見出しのみ）。次の回で実際に読んで、上の表を確かめる。

## 音源10枚の「追加のタイミング」（9回目・2026-11-28 決定案）
指示書：「追加のタイミングだけ決めておく（音源機能の実装はまだ）」。**本番の図鑑にはまだ入れない**（使えないカードをもらうと生徒さんが戸惑うため）。音を作ったら `cards.js` の ZKCARDS・ZKSND と daw_inner.js の INST・ZKI、zk_daw.py の chClean の ok リストに足す。

| # | id案 | 名前 | 音のイメージ | レア | 入手のタイミング | 状態 |
|---|---|---|---|---|---|---|
| 1 | s-orgel | オルゴール | ぜんまいの小さな鉄琴 | r | ログイン14日 | 実装済み |
| 2 | s-mokkin | 森の木琴 | マリンバ系 | s | 基礎編ぜんぶクリア | 実装済み |
| 3 | s-8bit | 8ビットの精 | 矩形波 | s | 提出10回 | 実装済み |
| 4 | s-epiano | ゆうぐれエレピ | ローズ風エレピ（夜の街・丸サ進行に合う） | r | 4-7 クリア（コード章のまんなか） | 未 |
| 5 | s-strings | 草原のストリングス | ゆっくり立ち上がる弦 | r | 第4章（4-1〜4-5）クリア | 未 |
| 6 | s-flute | 風のフルート | 息の音まじりの笛（メロディ向き） | n | 第3章クリア | 未 |
| 7 | s-synbass | うなるシンセベース | ノコギリ波＋フィルター | r | 第5章クリア | 未 |
| 8 | s-pad | 星空パッド | 広がるシンセパッド | r | ログイン20日 | 未 |
| 9 | s-guitar | 旅のアコギ | 弦をはじく音（Karplus-Strong 合成） | s | 提出5回（べつの日） | 未 |
| 10 | s-choir | 天使のコーラス | 「あー」の声（フォルマント） | s | ログイン50日／お題全クリア10回のどちらか | 未 |
- 3系統（レッスン・ログイン・提出）に散らし、レッスンの節目は「その音が活きる章」に合わせた（コード章→エレピ・ストリングス、ベース章→シンセベース、メロディ章→フルート）。
- 「新しい音源をもらったら、それを使えるお題が出やすくなる」は確認事項 0 のとおり保留。

## 称号5つ（9回目・v1.32.0 で本番へ）
| id | 名前 | 入手条件 |
|---|---|---|
| chd | 🪄 コードの まほうつかい | 第4章の 4-6・4-7・4-8 を全部クリア |
| dw5 | 🎛 DAWの みならい | DAW編のレッスンを5つクリア |
| z10 | 📖 図鑑の たび人 | 図鑑のカード10枚 |
| z30 | 🔍 図鑑の けんきゅう家 | 図鑑のカード30枚 |
| f10 | 🌟 お題の たつじん | お題を全部クリアして投稿10回 |
（既存の称号のしくみ bdDefs に追加。もちもの→しょうごう で一覧・🔒と条件が見える＝次の報酬が先に見える。図鑑のカードとは別の入れ物。）

## スキン10・着せ替え20（次の回へ）
- 既存：スキン（BDSK＝ホーム画面の色。クラシック＋7）、着せ替え（BDCH キャラ10・BDAC かざり8＝アイコン）。新しく作る分はこれと同じ入れ物に足す（保存形式を変えない）。
- 画像生成の道具がないので SVG で描く。スキンは「色＋背景のもよう（SVGのうすい柄：五線・音符・星・葉など）」、着せ替えはアイコンにのせるかざり（SVG）にする案。条件は図鑑のカードの条件と同じ3系統。
- 9回目：スキン10は v1.33.0 で完了（`_dev/tools/sk_add.py`。画面では「きせかえ」タブ）。
- 名前の注意：画面の「🎨 きせかえ」タブ＝指示書の「スキン」。指示書の「着せ替え20」は「🎭 アイコン」タブのキャラ（BDCH）・かざり（BDAC）に足す予定（今は絵文字。SVGの絵にするなら `bdAv` の表示も合わせて直す）。
