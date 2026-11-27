# ステップ6：コード章の基本レッスン 4-7「王道進行を使ってみよう」を作って、index.html と preview/index.html に組み込む。
# 先に l46_add.py を実行しておくこと（NEWL・つづきから などの仕組みは 4-6 のときに入れたもの）。何回実行しても同じ結果になる。
# 使い方：リポジトリ直下で  python3 _dev/tools/l47_add.py
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(ROOT, '_dev/lessons/base_4-3.html')

def build():
    h = open(BASE, encoding='utf8').read()
    def R(a, b):
        nonlocal h
        assert h.count(a) == 1, (a[:60], h.count(a))
        h = h.replace(a, b)
    R('<title>4-3 コードをならべよう</title>', '<title>4-7 王道進行を使ってみよう</title>')
    R('<header><b>4-3</b>　コードをならべよう</header>', '<header><b>4-7</b>　王道進行を使ってみよう</header>')
    i = h.index('var CFG={bpm:100,steps:['); j = h.index('var ctx=null')
    steps = r'''var ed=0; /* このステップで四角を変えたか（変えるまでは説明文を見せる） */
var GOAL4=[1,2,4,3],GN=['F','G','Em','Am'];
function csnd(i,v,t){drums(t,true);if(v>=0){chord(v,t,BAR*.97);bass(CH[v].r,t,BAR*.9)}}
function full(){for(var i=0;i<4;i++)if(g[i]<0)return false;return true}
function only(a){for(var i=0;i<4;i++)if(g[i]!==a[i])return false;return true}
var CFG={bpm:100,steps:[
{t:'新しいコード「Em（イー・マイナー）」をおぼえよう。ミ・ソ・シ の3つの音だよ。下の Am と Em を押して、聴きくらべてみよう。どちらも少しさみしい感じがするね。',pal:'chords',slots:0,spot:'pal',spotOnly:[3,4],gate:function(){return heard.c3&&heard.c4}},
{t:'J-POP でとてもよく使われる「王道進行」は、F → G → Em → Am。上の文字のとおりに、4つの四角へコードを入れて、▶ で聴いてみよう。',hint:'下のコードを選んでから、上の四角を押してね',pal:'chords',slots:4,reset:1,top:['1つめ：F','2つめ：G','3つめ：Em','4つめ：Am'],btns:['play'],spot:'play',snd:csnd,
 chk:function(i,v){if(v<0)return null;return v===GOAL4[i]?'good':'bad'},
 warn:function(){if(ed&&full()&&!only(GOAL4))return '上の文字（F → G → Em → Am）と、ちがう四角があるよ。もう一度えらんでみよう。'},
 gate:function(){return only(GOAL4)&&played>=1}},
{t:'せつなくて、まだつづきそうな感じがするね。さいごの Am を、おうちの C にかえるとどうなるかな？ A と B を聴きくらべよう。',pal:'chords',hidePal:1,slots:4,set:[1,2,4,3],fix:[0,1,2,3],fixMsg:'いまは聴くだけだよ。A と B を押してね',top:['F','G','Em','さいご'],btns:['A','B'],spot:function(){return heard.A?'B':'A'},snd:csnd,
 setA:function(){g=[1,2,4,3]},setB:function(){g=[1,2,4,0]},gate:function(){return heard.A&&heard.B}},
{t:'A（さいごが Am）はせつない感じ、B（さいごが C）はほっとする感じ。B は、王道進行のさいごだけをかえた形だよ。図鑑の「王道進行の巻物」も、この進行なんだ。好きなコードに入れかえて、いろいろ聴いてみよう！',pal:'chords',slots:4,set:[1,2,4,3],top:['1つめ','2つめ','3つめ','4つめ'],btns:['play','clear'],snd:csnd,last:1}
]};
'''
    h = h[:i] + steps + h[j:]
    R("{n:'Am',sub:'ラ・ド・ミ',v:[60,64,69],r:45,c:'#8a5cf0'}];", "{n:'Am',sub:'ラ・ド・ミ',v:[60,64,69],r:45,c:'#8a5cf0'},{n:'Em',sub:'ミ・ソ・シ',v:[59,64,67],r:40,c:'#9c5b2e'}];")
    R("window.__sg={", "window.__l47=1;window.__sg={")
    # A/B は最後まで聴いたら「聴いた」にする。光る案内は、まだ聴いていない方へ。パレットの光は spotOnly のものだけ
    R("Array.prototype.forEach.call($('mbtns').children,function(b){b.classList.toggle('spot',!ok&&s.spot===b.dataset.k)});",
      "var sp=typeof s.spot==='function'?s.spot():s.spot;Array.prototype.forEach.call($('mbtns').children,function(b){b.classList.toggle('spot',!ok&&sp===b.dataset.k)});")
    R("b.classList.toggle('spot',!ok&&s.spot==='pal'&&!b.classList.contains('heard'))",
      "b.classList.toggle('spot',!ok&&sp==='pal'&&!b.classList.contains('heard')&&(!s.spotOnly||s.spotOnly.indexOf(+b.dataset.i)>=0))")
    R("A:{t:'A を聴く',f:function(){var s=S[cur];s.setA();heard.A=1;renderSlots();playAll();gate()}},B:{t:'B を聴く',f:function(){var s=S[cur];s.setB();heard.B=1;renderSlots();playAll();gate()}}",
      "A:{t:'A を聴く',f:function(){var s=S[cur];s.setA();renderSlots();playAll();abWant='A';gate()}},B:{t:'B を聴く',f:function(){var s=S[cur];s.setB();renderSlots();playAll();abWant='B';gate()}}")
    R("function stopPlay(){", "var abWant='';function stopPlay(){abWant='';")
    R("played++;gate()}", "played++;if(abWant){heard[abWant]=1;abWant=''}gate()}")
    R("  var s=S[cur];if(fx[i])return;", "  var s=S[cur];if(fx[i]){if(s.fixMsg)hb(s.fixMsg);return}")
    R("  g[i]=brush;stopPlay();var it=item(brush);if(it){var t2=T0();it.pv(t2)}", "  g[i]=brush;ed=1;played=0;stopPlay();var it=item(brush);if(it){var t2=T0();if(s.slotpv)s.slotpv(i,brush,t2);else it.pv(t2)}")
    R("clear:{t:'けす',f:function(){", "clear:{t:'けす',f:function(){ed=1;played=0;")
    R("  cur=i;var s=S[i];$('line').textContent=s.t;", "  cur=i;ed=0;var s=S[i];$('line').textContent=s.t;")
    return h

QZ = "'4-7':[['「王道進行」のならびは？',['F → G → Em → Am','C → C → C → C','Am → G → F → C'],0,'F → G → Em → Am。J-POP でとてもよく使われるよ。'],['Em（イー・マイナー）の音は？',['ミ・ソ・シ','ド・ミ・ソ','ファ・ラ・ド'],0,'Em は ミ・ソ・シ。Am と同じく、少しさみしい響きだよ。']],\n"

def patch(path, lesson):
    h = open(path, encoding='utf8').read()
    def R(a, b, cnt=1):
        nonlocal h
        assert h.count(a) == cnt, (path, a[:60], h.count(a))
        h = h.replace(a, b)
    assert 'var NEWL=' in h, '先に l46_add.py を実行してください'
    i = h.index('var L=['); j = h.index('\n', i)
    L = json.loads(h[i+6:j].rstrip(';'))
    L = [l for l in L if l['id'] != '4-7']
    k = [x['id'] for x in L].index('4-6')
    L.insert(k+1, {'id': '4-7', 'title': '王道進行を使ってみよう', 'html': lesson})
    h = h[:i] + 'var L=' + json.dumps(L, ensure_ascii=False).replace('</', '<\\/') + ';' + h[j:]
    if "'4-6','4-7']" not in h:
        R("ids:['4-1','4-2','4-3','4-4','4-5','4-6']}", "ids:['4-1','4-2','4-3','4-4','4-5','4-6','4-7']}")
    if "'4-7':{icon:CHORDI}" not in h:
        R("'4-6':{icon:CHORDI},", "'4-6':{icon:CHORDI},'4-7':{icon:CHORDI},")
    if "'4-7':'王道進行を使える'" not in h:
        R("'4-6':'コードにリズムをつけられる',", "'4-6':'コードにリズムをつけられる','4-7':'王道進行を使える',")
    if "\n'4-7':[[" not in h:
        a = h.index("\n'5-1':[['ベースの役割は？'")
        h = h[:a+1] + QZ + h[a+1:]
    if "var NEWL=['4-6','4-7'];" not in h:
        R("var NEWL=['4-6'];", "var NEWL=['4-6','4-7'];")
    open(path, 'w', encoding='utf8').write(h)

if __name__ == '__main__':
    les = build()
    open(os.path.join(ROOT, '_dev/lessons/L_4-7.html'), 'w', encoding='utf8').write(les)
    for p in ('index.html', 'preview/index.html'):
        patch(os.path.join(ROOT, p), les)
    print('ok', len(les))
