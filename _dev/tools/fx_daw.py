def rep(o,n,cnt=1):
    global s
    assert s.count(o)==cnt,(o[:50],s.count(o))
    s=s.replace(o,n)
# 1 MIDI書き出しボタンをレッスンでも出せるように
rep("body.free #midiBtn{display:inline-block}","body.free #midiBtn,body.mid #midiBtn{display:inline-block}")
rep("document.body.classList.toggle('blk',!!LES[i].blk);","document.body.classList.toggle('blk',!!LES[i].blk);document.body.classList.toggle('mid',!!LES[i].mid);")
rep("{id:'D-69',ch:","{id:'D-69',mid:1,ch:") if s.count("{id:'D-69',ch:")==1 else rep('{id:"D-69",ch:','{id:"D-69",mid:1,ch:')
# 2 D-59: 「編集」メニューそのものを光らせる
rep('on:function(){if(openClip)selClip=openClip},tg:"#menu",ev:"quant"','on:function(){if(openClip)selClip=openClip},tg:"#menu span:nth-child(2)",rs:"#menu span:nth-child(2)",ev:"quant"')
# 3 説明カードを小さく（PCで画面の上半分をふさがない）
rep("#coach .tx{font-size:28px;font-weight:800;line-height:1.5;margin:6px 0 14px}","#coach .tx{font-size:21px;font-weight:800;line-height:1.5;margin:4px 0 10px}")
rep("#coach{position:fixed;left:24px;bottom:92px;width:min(580px,calc(100vw - 48px));background:#fff;color:#16304a;border-radius:24px;padding:22px 28px;","#coach{position:fixed;left:24px;bottom:92px;width:min(580px,calc(100vw - 48px));background:#fff;color:#16304a;border-radius:22px;padding:16px 22px;")
rep("#coach button{white-space:nowrap;font-weight:800;font-size:20px;border-radius:999px;border:0;padding:11px 28px;","#coach button{white-space:nowrap;font-weight:800;font-size:17px;border-radius:999px;border:0;padding:9px 22px;")
# 4 長い説明を短く
T=[
("ここが「トラック」の一覧。トラック＝楽器1つ分の担当。ドラム、ベース、メロディ…と、楽器ごとに分けて作るよ。名前はダブルクリックで変えられて、横長のフェーダー（音量）とつまみ（パン）も、ここで動かせるよ。",
 "ここが「トラック」の一覧。トラック＝楽器1つ分の担当。ドラム、ベース、メロディ…と、楽器ごとに分けて作るよ。名前はダブルクリックで変えられるよ。"),
("流れは「①使う音をしぼる → ②リズム → ③はじめと終わり → ④くりかえし → ⑤問いとこたえ」。ほかのDAWソフトでも、同じ手順で作れるよ。",
 "流れは「①音をしぼる → ②リズム → ③はじめと終わり → ④くりかえし → ⑤問いとこたえ」。どのDAWでも同じ手順だよ。"),
("マップの「自由につくる」で、自分だけの曲を作ってみよう。作った曲は「MIDI書き出し」で、ほかのDAWソフトに持っていけるよ。（音のバランスを整える「ミックス」は、つぎの章「ミックスしよう」でやるよ！）",
 "マップの「自由につくる」で、自分だけの曲を作ってみよう。作った曲は「MIDI書き出し」でほかのDAWに持っていけるよ。（ミックスは次の章でやるよ！）"),
("いま4つのトラックが鳴っているよ。ドラムはリズム、ベースは低い土台、コードは中くらいの高さで厚みを出す役、メロディは高くて主役。役割がちがうから、ぶつからずに1曲になるんだ。",
 "4つのトラックが鳴っているよ。ドラム＝リズム、ベース＝低い土台、コード＝厚み、メロディ＝高くて主役。役割がちがうから、ぶつからないんだ。"),
("どの楽器にも、自分の高さと役目がある。同じ高さで同じことをする楽器が増えると、ごちゃごちゃするよ。曲を作るときは「いまの主役はだれ？」を考えてみよう。",
 "どの楽器にも、自分の高さと役目がある。同じことをする楽器が増えるとごちゃごちゃするよ。「いまの主役はだれ？」を考えてみよう。"),
("ここからは「オーディオ」。MIDIは音符のデータ、オーディオは「録音された音そのもの」で、波のような形で見えるよ。ドラムのループ素材を用意したよ（出てくるまで、少し待ってね）。",
 "ここからは「オーディオ」。MIDIは音符のデータ、オーディオは「録音された音そのもの」で、波の形で見えるよ。ドラムのループ素材を用意したよ（少し待ってね）。"),
("オーディオ（ループ素材）と、MIDI（自分で打ち込む音）を組み合わせるのが、いちばん早く曲を作る方法だよ。自分の好きな素材は「スタジオ（自由につくる画面）」に読みこめるよ。",
 "ループ素材（オーディオ）と、自分で打ち込むMIDIを組み合わせるのが、いちばん早く曲を作る方法だよ。好きな素材は「スタジオ」に読みこめるよ。"),
("ダウンロードした .mid ファイルは、ほかのDAW（事業所の Fender Studio Pro など）にドラッグすれば開けて、好きな楽器の音で鳴らせるよ。音そのものとして書き出すのは、本物のDAWでやってみよう。",
 "ダウンロードした .mid は、ほかのDAW（Fender Studio Pro など）にドラッグすれば開けて、好きな楽器の音で鳴らせるよ。"),
("同じ強さで弾いた音は、ちょっとロボットみたい。人が弾くときは、強い音と弱い音がまざるよね。音の強さのことを「ベロシティ」というよ。まずは ▶ で聴いてみよう。",
 "同じ強さの音は、ちょっとロボットみたい。人が弾くと強弱がつくよね。この音の強さを「ベロシティ」というよ。まず ▶ で聴こう。"),
("ほかの音もえらんで、同じように「弱」にしよう。弱い音を3つ以上、強い音も3つ以上のこしてね。（音をえらんでから「つよさ」を押すよ。「強」にすると、もどせるよ）",
 "ほかの音も「弱」にしよう。弱い音を3つ以上、強い音も3つ以上のこしてね。（「強」でもどせるよ）"),
("まとめ：①音量バランス ②パン ③EQ。そして音を大きくしすぎないこと（マスターが赤にならないように）。次は「エフェクト」で、音に響きや迫力を足そう。",
 "まとめ：①音量 ②パン ③EQ。そして大きくしすぎないこと（マスターが赤にならないように）。次は「エフェクト」だよ。"),
("流れは「音量 → パン → EQ → コンプ → リバーブ・ディレイ」。最後は、耳で聴いて「かけすぎ」を戻す。ここまでで、ミックスの基本は一通りそろったよ。書き出しは、また次の機会に！",
 "流れは「音量 → パン → EQ → コンプ → リバーブ・ディレイ」。最後は耳で聴いて、かけすぎを戻そう。ミックスの基本は一通りそろったよ！"),
("コツは、「主役（メロディ）をいちばん大きく、土台（ドラム・ベース）は少し控えめに」。そして、一度に動かすのは1〜3トラックまで。1つずつ聴きながら調整しよう。（ミキサーを開かなくても、トラック一覧の横長フェーダーで同じ音量を動かせるよ。）",
 "コツは「主役（メロディ）をいちばん大きく、土台（ドラム・ベース）は少し控えめに」。一度に動かすのは1〜3トラックまで。1つずつ聴きながら調整しよう。"),
("音は「左・まん中・右」のどこから聞こえるかを決められる。これが「パン」。つまみを左に動かせば左から、右に動かせば右から聞こえるよ。（イヤホン・ヘッドホンだと分かりやすいよ。トラック一覧の小さなつまみも同じパンだよ）",
 "音は「左・まん中・右」のどこから聞こえるかを決められる。これが「パン」。つまみを左に動かせば左から聞こえるよ。（イヤホンだと分かりやすいよ）"),
("とくちょう②：キックは1小節に2回だけ（1番めと11番め）。スネアは5番めと13番め（2拍め・4拍め）。この「ドン・パン・・ドン・パン」が「ツーステップ」という、ドラムンベースの基本のリズムだよ。",
 "とくちょう②：キックは1小節に2回（1番めと11番め）、スネアは5番めと13番め。この「ドン・パン・・ドン・パン」が、ドラムンベースの基本リズム「ツーステップ」だよ。"),
]
for o,n in T:
    if s.count("'"+o+"'")==1: rep("'"+o+"'","'"+n+"'")
    elif s.count('"'+o+'"')==1: rep('"'+o+'"','"'+n+'"')
    else: print('SKIP',o[:30],s.count(o))
# 5 編集・表示メニューの追加項目（クオンタイズ等）が反映されていなかった：メニューを作り直して結びつける
rep("['ファイル','セッション'].forEach(function(n){Array.prototype.forEach.call(document.querySelectorAll('#menu span:not(.sp)')","['ファイル','編集','セッション','表示'].forEach(function(n){Array.prototype.forEach.call(document.querySelectorAll('#menu span:not(.sp)')")
# 6 つよさ・長さのレッスンは、音をえらぶ／のばす操作ができる自由モードの入力を使う
rep("if(free&&e.button===0&&!(chordArm>=0&&!isD(curTrack()))){freeGrid(e);return}","if((free||lesFree)&&e.button===0&&!(chordArm>=0&&!isD(curTrack()))){freeGrid(e);return}")
rep("var waiting=null","var lesFree=false;var waiting=null")
rep("document.body.classList.toggle('mid',!!LES[i].mid);","document.body.classList.toggle('mid',!!LES[i].mid);lesFree=!!LES[i].fg;")
for _id in ('D-57','D-58'):
    if s.count("{id:'%s',ch:"%_id)==1: rep("{id:'%s',ch:"%_id,"{id:'%s',fg:1,ch:"%_id)
    else: rep('{id:"%s",ch:'%_id,'{id:"%s",fg:1,ch:'%_id)
