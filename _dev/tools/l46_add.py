# ステップ6：コード章の基本レッスン 4-6「コードのリズム」を作って、index.html と preview/index.html に組み込む。
# 何回実行しても同じ結果になる（すでに 4-6 があれば作り直して置きかえる）。
# 使い方：リポジトリ直下で  python3 _dev/tools/l46_add.py
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(ROOT, '_dev/lessons/base_4-3.html')   # 4-3 の中身（同じ形式のレッスン部品）

def build():
    h = open(BASE, encoding='utf8').read()
    def R(a, b):
        nonlocal h
        assert h.count(a) == 1, (a[:60], h.count(a))
        h = h.replace(a, b)
    R('<title>4-3 コードをならべよう</title>', '<title>4-6 コードのリズム</title>')
    R('<header><b>4-3</b>　コードをならべよう</header>', '<header><b>4-6</b>　コードのリズム</header>')
    i = h.index('var CFG={bpm:100,steps:['); j = h.index('var ctx=null')
    steps = r'''var BARS=['1小節め','2小節め','3小節め','4小節め'];
var PRG=[0,2,3,1],PRN=['C','G','Am','F'];
/* コードを鳴らすリズム（8分音符を1マスとして [はじまり, 長さ]） */
var RP=[{n:'のばす',sub:'1回',c:'#2c64f0',p:[[0,8]]},{n:'2回',sub:'タ〜ン タ〜ン',c:'#1f9d6b',p:[[0,4],[4,4]]},{n:'4回',sub:'タン タン タン タン',c:'#e0841f',p:[[0,2],[2,2],[4,2],[6,2]]},{n:'はずむ',sub:'タン・タン・タ',c:'#8a5cf0',p:[[0,3],[3,3],[6,2]]}];
function crh(ci,p,t){var E=BAR/8;RP[p].p.forEach(function(x){chord(ci,t+x[0]*E,x[1]*E*.92)})}
function rsnd(i,v,t){drums(t,true);if(v>=0)crh(PRG[i],v,t)}
function rlab(i){return PRN[i]}
function rsub(i,v){return v>=0?RP[v].n:'リズム？'}
function rcol(i,v){return v>=0?RP[v].c:'#999'}
function full(){for(var i=0;i<4;i++)if(g[i]<0)return false;return true}
function only(a){for(var i=0;i<4;i++)if(g[i]!==a[i])return false;return true}
var CFG={bpm:100,steps:[
{t:'まずはおさらい。4-3 で聴いた C → G → Am → F だよ。▶ を押して聴いてみよう。いまは、どのコードも1小節ずっと「のばして」いるよ。',pal:'chords',hidePal:1,slots:4,set:[0,2,3,1],fix:[0,1,2,3],top:BARS,btns:['play'],spot:'play',snd:function(i,v,t){drums(t,true);if(v>=0)chord(v,t,BAR*.97)},gate:function(){return played>=1}},
{t:'コードは、鳴らす「リズム」を変えられるんだ。下の3つのリズムを、ぜんぶ押して聴きくらべてみよう。',pal:'crhy3',slots:0,spot:'pal',gate:function(){return heard.r0&&heard.r1&&heard.r2}},
{t:'4つの小節に、リズムを入れよう。まずは、ぜんぶ「4回」にして ▶ で聴いてみよう。',hint:'下のリズムを選んでから、上の四角を押してね',pal:'crhy3',slots:4,reset:1,top:BARS,lab:rlab,sublab:rsub,slotc:rcol,btns:['play'],spot:'play',snd:rsnd,
 warn:function(){if(full()&&!only([2,2,2,2]))return 'ぜんぶ「4回」にしてみよう。ちがう四角は、「4回」を選んでから押すと変わるよ。'},
 gate:function(){return only([2,2,2,2])&&played>=1}},
{t:'4回だと、ノリが出るね！ つぎは、さいごの4小節めだけ「のばす」にして ▶ で聴こう。さいごをのばすと「おわった〜」という感じが出るよ。',pal:'crhy3',top:BARS,lab:rlab,sublab:rsub,slotc:rcol,btns:['play'],spot:'play',snd:rsnd,
 warn:function(){if(full()&&!only([2,2,2,0]))return '1〜3小節めは「4回」、4小節めだけ「のばす」にしよう。'},
 gate:function(){return only([2,2,2,0])&&played>=1}},
{t:'もう1つ、「はずむ」リズムがあるよ。「タン・タン・タ」と、少しずらして鳴らすんだ。どこか1つ以上の小節を「はずむ」にして、▶ で聴いてみよう。',pal:'crhy',top:BARS,lab:rlab,sublab:rsub,slotc:rcol,btns:['play'],spot:'play',snd:rsnd,
 warn:function(){if(full()&&g.indexOf(3)<0)return '下の「はずむ」を選んでから、上の四角を1つ押してみよう。'},
 gate:function(){return full()&&g.indexOf(3)>=0&&played>=1}},
{t:'同じコードでも、リズムを変えるだけで雰囲気がガラッと変わるね。好きなリズムを組み合わせて、いろいろ聴いてみよう！',pal:'crhy',top:BARS,lab:rlab,sublab:rsub,slotc:rcol,btns:['play','clear'],snd:rsnd,last:1}
]};
'''
    h = h[:i] + steps + h[j:]
    # リズムのパレット（プレビューは C のコード＋ドラム1小節）
    R(" chords:function(){return CH.map(",
      " crhy3:function(){return PALS.crhy().slice(0,3)},\n"
      " crhy:function(){return RP.map(function(r,i){return {n:r.n,sub:r.sub,c:r.c,pv:function(t){drums(t,true);crh(0,i,t)},k:'r'+i}})},\n"
      " chords:function(){return CH.map(")
    # テスト用：4-6 だけの印
    R("window.__sg={", "window.__l46=1;window.__sg={")
    return h

QZ46 = "'4-6':[['同じコードを「のばす」から「4回」に変えると？',['リズムが生まれて、ノリが出る','コードの名前が変わる','音が出なくなる'],0,'同じコードでも、鳴らすリズムで雰囲気が変わるよ。'],['さいごの小節だけ「のばす」にすると、どんな感じ？',['「おわった〜」と落ち着く感じ','もっとつづきそうな感じ','音が高くなる'],0,'さいごにゆったりのばすと、落ち着いて終われるよ。']],\n"

def patch(path, lesson):
    h = open(path, encoding='utf8').read()
    def R(a, b, cnt=1):
        nonlocal h
        assert h.count(a) == cnt, (path, a[:60], h.count(a))
        h = h.replace(a, b)
    # 1) L 配列
    i = h.index('var L=['); j = h.index('\n', i)
    L = json.loads(h[i+6:j].rstrip(';'))
    L = [l for l in L if l['id'] != '4-6']
    k = [x['id'] for x in L].index('4-5')
    L.insert(k+1, {'id': '4-6', 'title': 'コードのリズム', 'html': lesson})
    s = json.dumps(L, ensure_ascii=False).replace('</', '<\\/')
    h = h[:i] + 'var L=' + s + ';' + h[j:]
    # 2) 章・アイコン・目標
    if "'4-5','4-6']" not in h:
        R("ids:['4-1','4-2','4-3','4-4','4-5']}", "ids:['4-1','4-2','4-3','4-4','4-5','4-6']}")
    if "'4-6':{icon:CHORDI}" not in h:
        R("'4-5':{icon:CHORDI},", "'4-5':{icon:CHORDI},'4-6':{icon:CHORDI},")
    if "'4-6':'コードにリズムをつけられる'" not in h:
        R("'4-5':'メロディにコードをつけられる',", "'4-5':'メロディにコードをつけられる','4-6':'コードにリズムをつけられる',")
    # 3) ふり返りクイズ
    if "\n'4-6':[[" not in h:
        a = h.index("\n'5-1':[['ベースの役割は？'")
        h = h[:a+1] + QZ46 + h[a+1:]
    # 4) 「つづきから」：前回のレッスンがクリア済みなら、そのあとの未クリアへ（新しく増えたレッスンで、前の章へ引きもどさない）
    old = "if(k<0){for(var i=0;i<L.length;i++)if(!isDone(L[i].id)){k=i;break}}return k<0?L.length-1:k}"
    new = "if(k<0&&p&&p.last){var a0=L.map(function(l){return l.id}).indexOf(p.last);if(a0>=0)for(var i0=a0+1;i0<L.length;i0++)if(!isDone(L[i0].id)){k=i0;break}}\n  " + old
    if "var a0=L.map(function(l){return l.id}).indexOf(p.last)" not in h:
        R(old, new)
    open(path, 'w', encoding='utf8').write(h)

if __name__ == '__main__':
    les = build()
    open(os.path.join(ROOT, '_dev/lessons/L_4-6.html'), 'w', encoding='utf8').write(les)
    for p in ('index.html', 'preview/index.html'):
        patch(os.path.join(ROOT, p), les)
    print('ok', len(les))
