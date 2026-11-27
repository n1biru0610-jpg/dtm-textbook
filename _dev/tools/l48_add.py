# ステップ6：コード章の基本レッスン 4-8「コードを完成させよう」（コード章のまとめ）を作って、index.html と preview/index.html に組み込む。
# 先に l46_add.py → l47_add.py を実行しておくこと。何回実行しても同じ結果になる。
# 使い方：リポジトリ直下で  python3 _dev/tools/l48_add.py
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(ROOT, '_dev/lessons/base_4-3.html')

def build():
    h = open(BASE, encoding='utf8').read()
    def R(a, b):
        nonlocal h
        assert h.count(a) == 1, (a[:60], h.count(a))
        h = h.replace(a, b)
    R('<title>4-3 コードをならべよう</title>', '<title>4-8 コードを完成させよう</title>')
    # スマホ横：上の文字（メロディの音）が、親ページの「ホーム／スタジオ／図鑑」のボタンにかくれないように、見出しの高さをとる
    R("main{min-height:auto!important;flex:1 0 auto!important}\n</style>", "main{min-height:auto!important;flex:1 0 auto!important}\n@media (max-height:500px) and (orientation:landscape) and (pointer:coarse){header{min-height:42px!important}}\n</style>")
    R('.sl.good::after{', '.sl.bad::after{content:"×";position:absolute;top:4px;right:10px;color:#fff;background:var(--red);border-radius:50%;width:24px;height:24px;font-size:16px;line-height:24px;text-align:center}\n.sl.good::after{')
    R("(lab||'まだ空いているよ'))+(sub?'（'+sub+'）':''));", "(lab||'まだ空いているよ'))+(sub?'（'+sub+'）':'')+(s.chk?(s.chk(i,v)==='good'?'、ぴったり':s.chk(i,v)==='bad'?'、ちがうよ':''):''));")
    R('<header><b>4-3</b>　コードをならべよう</header>', '<header><b>4-8</b>　コードを完成させよう</header>')
    i = h.index('var CFG={bpm:100,steps:['); j = h.index('var ctx=null')
    steps = r'''var ed=0; /* このステップで四角を変えたか（変えるまでは説明文を見せる） */
/* メロディ（8分音符を1マスとして [音, はじまり, 長さ]）。答えのコードは C → Am → F → C */
var MEL=[[[64,0,2],[67,2,2],[64,4,2],[60,6,2]],[[69,0,3],[72,3,1],[69,4,2],[64,6,2]],[[72,0,2],[69,2,2],[65,4,3],[69,7,1]],[[67,0,1],[64,1,1],[60,2,6]]];
var MTOP=['ミ・ソ・ミ・ド','ラ・ド・ラ・ミ','ド・ラ・ファ・ラ','ソ・ミ・ド'];
var CC=[0,3,1,0],RR=[0,0,0,0],solo=0;
/* コードを鳴らすリズム（4-6 と同じ） */
var RP=[{n:'のばす',sub:'1回',c:'#2c64f0',p:[[0,8]]},{n:'2回',sub:'タ〜ン タ〜ン',c:'#1f9d6b',p:[[0,4],[4,4]]},{n:'4回',sub:'タン タン タン タン',c:'#e0841f',p:[[0,2],[2,2],[4,2],[6,2]]},{n:'はずむ',sub:'タ〜ン・タ〜ン・タン',c:'#8a5cf0',p:[[0,3],[3,3],[6,2]]}];
function crh(ci,p,t){var E=BAR/8;RP[p].p.forEach(function(x){chord(ci,t+x[0]*E,x[1]*E*.92)})}
function mel(i,t){var E=BAR/8;MEL[i].forEach(function(x){blip(x[0]+12,t+x[1]*E,Math.max(1,x[2]*E/.5))})}
function fits(i,v){return v>=0&&MEL[i].every(function(x){return CH[v].v.some(function(m){return m%12===x[0]%12})})}
function full(){for(var i=0;i<4;i++)if(g[i]<0)return false;return true}
function allfit(){for(var i=0;i<4;i++)if(!fits(i,g[i]))return false;return true}
function rr(i){return RR[i]>=0?RR[i]:0}
function band(i,v,t){drums(t,true);if(v>=0){crh(v,rr(i),t);bassPat(1,CH[v].r,t)}mel(i,t)}
function csub(i,v){return v>=0?RP[v].n:'リズム？'}
function ccol(i,v){return v>=0?RP[v].c:'#999'}
var CFG={bpm:100,steps:[
{t:'コードの章のまとめだよ。まずは、伴奏をつけるメロディを ▶ で聴いてみよう。上に書いてあるのが、それぞれの小節のメロディの音だよ。',fixMsg:'いまは聴くだけだよ。▶ を押してね',pal:'chords',hidePal:1,slots:4,set:[-1,-1,-1,-1],fix:[0,1,2,3],top:MTOP,lab:function(){return '♪'},sublab:function(){return 'メロディ'},slotc:function(){return '#8a95a1'},btns:['play'],spot:'play',snd:function(i,v,t){drums(t,false);mel(i,t)},gate:function(){return played>=1}},
{t:'4-5 のおさらい。メロディの音が「ぜんぶ入っている」コードを、4つの小節に入れよう。コードの下に書いてある3つの音と、上のメロディの音をくらべてね。できたら ▶ で聴こう。',hint:'下のコードを選んでから、上の四角を押してね',pal:'chords',slots:4,reset:1,top:MTOP,btns:['play'],spot:'play',
 snd:function(i,v,t){if(v>=0)chord(v,t,BAR*.97);mel(i,t)},
 chk:function(i,v){if(v<0)return null;return fits(i,v)?'good':'bad'},
 warn:function(){if(ed&&full()&&!allfit())return '×の四角があるよ。上のメロディの音が、ぜんぶ入っているコードをさがしてみよう。'},
 gate:function(){return allfit()&&played>=1}},
{enter:function(){CC=[0,3,1,0]},t:'ぴったりのコードは C → Am → F → C。さいごはおうちの C だね。つぎは、4-6 でやった「リズム」をつけよう。4つの小節ぜんぶに、好きなリズムを入れて ▶ で聴いてみよう。',hint:'下のリズムを選んでから、上の四角を押してね',pal:'crhy',slots:4,reset:1,top:MTOP,
 lab:function(i){return CH[CC[i]].n},sublab:csub,slotc:ccol,btns:['play'],spot:'play',
 slotpv:function(i,v,t){crh(CC[i],v,t);mel(i,t)},
 snd:function(i,v,t){drums(t,true);if(v>=0)crh(CC[i],v,t);mel(i,t)},
 warn:function(){if(ed&&!full())return 'まだ「リズム？」の四角があるよ。4つぜんぶに、リズムを入れよう。'},
 gate:function(){return full()&&played>=1}},
{enter:function(){RR=g.slice();solo=0},t:'さいごに、ひくい音の「ベース」と「ドラム」も入れたよ（ベースは5章でくわしくやるよ）。「メロディだけ」と「伴奏つき」を聴きくらべてみよう。',fixMsg:'いまは聴くだけだよ。下のボタンを押してね',pal:'chords',hidePal:1,slots:4,set:function(){return CC.slice()},fix:[0,1,2,3],top:MTOP,
 lab:function(i,v){return CH[v].n},sublab:function(i){return RP[rr(i)].n},slotc:function(i,v){return CH[v].c},btns:['mo','ba'],spot:function(){return heard.mo?'ba':'mo'},
 snd:function(i,v,t){if(solo){mel(i,t)}else band(i,v,t)},gate:function(){return heard.mo&&heard.ba}},
{t:'伴奏があると、ぐっと曲らしくなるね！ これで、メロディに伴奏をつけられるようになったよ。コードを入れかえて、いろいろ聴いてみよう。',pal:'chords',slots:4,set:function(){return CC.slice()},top:MTOP,
 lab:function(i,v){return v>=0?CH[v].n:''},sublab:function(i,v){return v>=0?RP[rr(i)].n:''},btns:['play','clear'],
 chk:function(i,v){if(v<0)return null;return fits(i,v)?'good':'bad'},
 slotpv:function(i,v,t){crh(v,rr(i),t);mel(i,t)},snd:band,last:1}
]};
'''
    h = h[:i] + steps + h[j:]
    R("{n:'Am',sub:'ラ・ド・ミ',v:[60,64,69],r:45,c:'#8a5cf0'}];", "{n:'Am',sub:'ラ・ド・ミ',v:[60,64,69],r:45,c:'#8a5cf0'},{n:'Em',sub:'ミ・ソ・シ',v:[59,64,67],r:40,c:'#9c5b2e'}];")
    R(" chords:function(){return CH.map(",
      " crhy:function(){return RP.map(function(r,i){return {n:r.n,sub:r.sub,c:r.c,pv:function(t){drums(t,true);crh(0,i,t)},k:'r'+i}})},\n"
      " chords:function(){return CH.map(")
    R("window.__sg={", "window.__l48=1;window.__sg={")
    # 光る案内：関数でも指定できるように
    R("Array.prototype.forEach.call($('mbtns').children,function(b){b.classList.toggle('spot',!ok&&s.spot===b.dataset.k)});",
      "var sp=typeof s.spot==='function'?s.spot():s.spot;Array.prototype.forEach.call($('mbtns').children,function(b){b.classList.toggle('spot',!ok&&sp===b.dataset.k)});")
    R("b.classList.toggle('spot',!ok&&s.spot==='pal'&&!b.classList.contains('heard'))",
      "b.classList.toggle('spot',!ok&&sp==='pal'&&!b.classList.contains('heard'))")
    # 「メロディだけ」「伴奏つき」：最後まで聴いたら「聴いた」になる
    R("function mkBtns(l){",
      "BTN.mo={t:'▶ メロディだけ',f:function(){solo=1;playAll();abWant='mo';gate()}};BTN.ba={t:'▶ 伴奏つき',f:function(){solo=0;playAll();abWant='ba';gate()}};\nfunction mkBtns(l){")
    R("function stopPlay(){", "var abWant='';function stopPlay(){abWant='';")
    R("played++;gate()}", "played++;if(abWant){heard[abWant]=1;abWant=''}gate()}")
    R("  var s=S[cur];if(fx[i])return;", "  var s=S[cur];if(fx[i]){if(s.fixMsg)hb(s.fixMsg);return}")
    R("  g[i]=brush;stopPlay();var it=item(brush);if(it){var t2=T0();it.pv(t2)}", "  g[i]=brush;ed=1;played=0;stopPlay();var it=item(brush);if(it){var t2=T0();if(s.slotpv)s.slotpv(i,brush,t2);else it.pv(t2)}")
    R("clear:{t:'けす',f:function(){", "clear:{t:'けす',f:function(){ed=1;played=0;")
    R("  cur=i;var s=S[i];$('line').textContent=s.t;", "  cur=i;ed=0;var s=S[i];$('line').textContent=s.t;")
    # ステップに入るときの準備（enter）と、set を関数でも書けるように
    R("if(s.set){var a=s.set;", "if(s.enter)s.enter();if(s.set){var a=typeof s.set==='function'?s.set():s.set;")
    return h

QZ = "'4-8':[['メロディにコードをつけるとき、えらぶとよいのは？',['メロディの音が入っているコード','いちばん高い音のコード','どの小節もちがうコード'],0,'メロディの音が入っているコードだと、ぴったり合うよ。'],['今回、メロディに足した「伴奏」は？',['コード・ベース・ドラム','歌詞','もう1つのメロディだけ'],0,'コードにリズムをつけて、ベースとドラムを足すと、伴奏の完成だよ。']],\n"

def patch(path, lesson):
    h = open(path, encoding='utf8').read()
    def R(a, b, cnt=1):
        nonlocal h
        assert h.count(a) == cnt, (path, a[:60], h.count(a))
        h = h.replace(a, b)
    assert "var NEWL=['4-6','4-7" in h, '先に l46_add.py と l47_add.py を実行してください'
    i = h.index('var L=['); j = h.index('\n', i)
    L = json.loads(h[i+6:j].rstrip(';'))
    L = [l for l in L if l['id'] != '4-8']
    k = [x['id'] for x in L].index('4-7')
    L.insert(k+1, {'id': '4-8', 'title': 'コードを完成させよう', 'html': lesson})
    h = h[:i] + 'var L=' + json.dumps(L, ensure_ascii=False).replace('</', '<\\/') + ';' + h[j:]
    if "'4-7','4-8']" not in h:
        R("ids:['4-1','4-2','4-3','4-4','4-5','4-6','4-7']}", "ids:['4-1','4-2','4-3','4-4','4-5','4-6','4-7','4-8']}")
    if "'4-8':{icon:CHORDI}" not in h:
        R("'4-7':{icon:CHORDI},", "'4-7':{icon:CHORDI},'4-8':{icon:CHORDI},")
    if "'4-8':'メロディに伴奏をつけられる'" not in h:
        R("'4-7':'王道進行を使える',", "'4-7':'王道進行を使える','4-8':'メロディに伴奏をつけられる',")
    if "\n'4-8':[[" not in h:
        a = h.index("\n'5-1':[['ベースの役割は？'")
        h = h[:a+1] + QZ + h[a+1:]
    if "var NEWL=['4-6','4-7','4-8'];" not in h:
        R("var NEWL=['4-6','4-7'];", "var NEWL=['4-6','4-7','4-8'];")
    open(path, 'w', encoding='utf8').write(h)

if __name__ == '__main__':
    les = build()
    open(os.path.join(ROOT, '_dev/lessons/L_4-8.html'), 'w', encoding='utf8').write(les)
    for p in ('index.html', 'preview/index.html'):
        patch(os.path.join(ROOT, p), les)
    print('ok', len(les))
