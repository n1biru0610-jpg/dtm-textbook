# TAC BASE の音源（DTM教材のDAW用）

DAW（スタジオ・お題）の「録音の楽器」で使う素材です。使うときだけ読みこみます。

- `inst/` … 楽器の録音（FLAC）と定義（`*.json`、TAC BASE の tac-instrument 形式）。27音色＋弦の奏法8種。
  録音は FreePats・VSCO 2 CE・VCSL・Meta Steel Guitar の **CC0 1.0** 素材（各 `*-NOTICES.txt` / `*-CC0.txt` を参照）。
  マイナースタブ（MinorStabA）は TAC BASE で制作した音。
- `drums/` … ドラム5キット（DISTKIT / SDBKIT / SYNTHKIT / X0X PROC 1・2）。Stargate Sample Pack（Fugue State Audio）の **CC0** 素材（`LICENSE.txt` / `SOURCE.txt`）。

元データ：TAC BASE 音源引き継ぎパック（実機ビルド 2611.28.19、ソース f8829fb3）。
組み込みは `_dev/tools/tac_add.py`、テストは `_dev/tools/tac.js`。
