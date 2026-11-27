import json,re
def js(x):return json.dumps(x,ensure_ascii=False)
# ---------- 1) 機能：つよさ（ベロシティ）・フックなど ----------
rep('<div class="qz" id="qzS">スナップ<b>順応</b></div>','<div class="qz" id="qzS">スナップ<b>順応</b></div><div class="qz" id="qzV" role="button" tabindex="0">つよさ<b>強</b></div>')
rep("if(t.kind==='drum'){KIT=t.kit||0;SMPT=t;if(DK[n.p])DK[n.p](nextT+off);KIT=0;SMPT=null}else tone(n.p+(t.oct||0)*12,nextT+off,n.l*sd()*.95*(t.len||1),t.inst)}",
    "var O0=OUT;if(n.v!=null&&n.v<.99&&O0){var vg=ctx.createGain();vg.gain.value=n.v;vg.connect(O0);OUT=vg}if(t.kind==='drum'){KIT=t.kit||0;SMPT=t;if(DK[n.p])DK[n.p](nextT+off);KIT=0;SMPT=null}else tone(n.p+(t.oct||0)*12,nextT+off,n.l*sd()*.95*(t.len||1),t.inst);OUT=O0}")
rep("e._n=n;if(nsel.indexOf(n)>=0)e.classList.add('sel');g.appendChild(e)})}","e._n=n;if(n.v!=null)e.style.opacity=.3+.7*n.v;if(nsel.indexOf(n)>=0)e.classList.add('sel');g.appendChild(e)})}")
rep("var nn={s:edSnap(sf),p:p,l:dr?Math.min(1,qz):Math.max(2,qz)};c.notes.push(nn)","var nn={s:edSnap(sf),p:p,l:dr?Math.min(1,qz):Math.max(2,qz)};if(VD<.99)nn.v=VD;c.notes.push(nn)")
rep("[144|ch,p,100]","[144|ch,p,n.v==null?100:Math.max(1,Math.round(127*n.v))]")
s_=s
assert s.count("{s:n.s,p:n.p,l:n.l}")==3
s=re.sub(r"(return)?\{s:n\.s,p:n\.p,l:n\.l\}",lambda m:"return cpN(n)" if m.group(1) else "cpN(n)",s)
rep("return{s:c.s+len,l:c.l,notes:c.notes.map(function(n){return cpN(n)})}","var cc=JSON.parse(JSON.stringify(c));cc.s=c.s+len;return cc")
rep("function quantizeClip(c){stat('quantize');if(!c){","function quantizeClip(c){stat('quantize');if(c)setTimeout(function(){fire('quant')},60);if(!c){")
rep("sfx('ok');toast('プロジェクトを書き出したよ","fire('saved');sfx('ok');toast('プロジェクトを書き出したよ")
rep("midiB64()}},'*')}catch(e){}sfx('ok')}","midiB64()}},'*')}catch(e){}sfx('ok');fire('midiOut')}")
HELP=r"""
function cpN(n){var o={s:n.s,p:n.p,l:n.l};if(n.v!=null)o.v=n.v;return o}
var VD=1,VL=[['強（いちばん大きい音）',1],['中（ふつう）',.7],['弱（小さい音）',.4]];
function vName(v){return v>=.99?'強':v>=.6?'中':'弱'}
function vReset(){VD=1;var e=$('qzV');if(e)e.querySelector('b').textContent='強'}
function vSet(v){VD=v;$('qzV').querySelector('b').textContent=vName(v);var k=0;if(nsel&&nsel.length){nsel.forEach(function(n){if(v>=.99)delete n.v;else n.v=v;k++});if(openClip){renderEd();renderTracks()}}toast('つよさ：'+vName(v)+(k?'（えらんだ音 '+k+'こ）':'（これから置く音。音をえらんでから押すと、その音がかわるよ）'));fire('velSet',k)}
(function(){var e=$('qzV');if(!e)return;function open(ev){ev.stopPropagation();if(blocked())return;var r=e.getBoundingClientRect();ctxShow(r.left,r.bottom+4,VL.map(function(x){return {t:(VD===x[1]?'✓ ':'　')+x[0],k:'',f:function(){vSet(x[1])}}}))}e.onclick=open;e.onkeydown=function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();open(ev)}}})();
function nHas(s,p){return !!openClip&&openClip.notes.some(function(n){return n.s===s&&n.p===p})}
function nAll(a){return a.every(function(x){return nHas(x[0],x[1])})}
function exWav(){var sr=22050,bs=240/bpm,n=Math.round(sr*bs*2),d=new Float32Array(n);
  function add(t0,len,f){var a=Math.round(t0*sr),m=Math.round(len*sr);for(var j=0;j<m&&a+j<n;j++)d[a+j]+=f(j/sr)}
  for(var b=0;b<2;b++){var o=b*bs;for(var q=0;q<4;q++){var t=o+q*bs/4;
    add(t,.3,function(x){return Math.sin(6.2832*(50*x+(110/30)*(1-Math.exp(-30*x))))*Math.exp(-x*13)*.85});
    if(q===1||q===3)add(t,.2,function(x){return (Math.random()*2-1)*Math.exp(-x*22)*.45});
    add(t,.05,function(x){return (Math.random()*2-1)*Math.exp(-x*90)*.18});add(t+bs/8,.05,function(x){return (Math.random()*2-1)*Math.exp(-x*90)*.12})}}
  var buf=new ArrayBuffer(44+n*2),v=new DataView(buf);function w(o,t){for(var i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))}
  w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(var i=0;i<n;i++){var x=Math.max(-1,Math.min(1,d[i]));v.setInt16(44+i*2,x<0?x*32768:x*32767,true)}return buf}
function exAuPre(withMel){return function(){T=[];vReset();T.push({name:'ドラムループ',kind:'audio',c:COLS[0],clips:[]});var mc=null;
  if(withMel){addTrack('メロディ');mc={s:0,l:8,notes:[]};T[1].clips.push(mc)}
  selClip=null;closeEd();renderTracks();if(mc)openEd(T[1],mc);
  var id=auId();auDecode(id,'ドラムループ',exWav()).then(function(){var n=withMel?4:1;for(var k=0;k<n;k++)auPlace(T[0],id,k*2);selClip=null;renderTracks();if(mc)renderEd()})}}
"""
rep("function byS(c){",HELP+"function byS(c){")
# ---------- 2) レッスン ----------
def S(say,tg=None,rs=None,ev=None,need=None,ok=None,nxt=False,gs=None,pts=None,dk=None,on=None):
    p=['say:'+js(say)]
    if on:p.append('on:'+on)
    if tg:p.append('tg:'+js(tg))
    if rs:p.append('rs:'+js(rs))
    if gs:p.append('gs:'+js(gs))
    if pts:p.append('pts:'+pts)
    if dk:p.append('dk:'+dk)
    if ev:p.append('ev:'+js(ev))
    if need:p.append('need:'+need)
    if ok:p.append('ok:'+js(ok))
    if nxt:p.append('next:1')
    return '{'+','.join(p)+'}'
def LS(id,ch,ic,t,g,pre,steps,extra=''):
    return "{id:%s,ch:%d,ic:%s,t:%s,g:%s,%spre:%s,steps:[\n %s]}"%(js(id),ch,js(ic),js(t),js(g),extra,pre,',\n '.join(steps))
PLAY=lambda say,ok:S(say,tg='#play',ev='played',ok=ok)
def chord(st,ps,l=16):return [[st,p,l] for p in ps]
def mel(bars,notes,extra=''):return "function(){vReset();melPre(%d,%s)();setTool('sel')%s}"%(bars,json.dumps(notes),extra)
E=[];F=[];H=[];AU=[];EX=[]
# --- E 音をいきいきさせよう (ch4)
E.append(LS('D-57',4,'📶','音の強さ（ベロシティ）','強い音と弱い音を使い分けられる',
 mel(2,[[0,67],[4,69],[8,67],[12,64],[16,67],[20,69],[24,72],[28,67]]),[
 PLAY('同じ強さで弾いた音は、ちょっとロボットみたい。人が弾くときは、強い音と弱い音がまざるよね。音の強さのことを「ベロシティ」というよ。まずは ▶ で聴いてみよう。','ぜんぶ同じ強さだから、ちょっと機械的だね。'),
 S('音を1つクリックして、えらぼう（えらんだ音が光るよ）。',tg='#escroll',rs='#grid .nt',ev='noteSel',ok='えらべたね。'),
 S('上の「つよさ」を押して「弱」をえらぼう。えらんだ音がうすくなって、小さく鳴るよ。',tg='#qzV',ev='velSet',need='function(a){return a>=1}',ok='うすくなったね。これが「弱い音」だよ。'),
 S('ほかの音もえらんで、同じように「弱」にしよう。弱い音を3つ以上、強い音も3つ以上のこしてね。（音をえらんでから「つよさ」を押すよ。「強」にすると、もどせるよ）',tg='#qzV',rs='#grid .nt',ev='velSet',need='function(){return !!openClip&&openClip.notes.filter(function(n){return n.v!=null&&n.v<.99}).length>=3&&openClip.notes.filter(function(n){return n.v==null||n.v>=.99}).length>=3}',ok='強い音と弱い音がまざったね。'),
 PLAY('▶ で聴こう。','強弱がつくと、人が弾いているみたいに聞こえるよ。'),
 S('コツ：メロディの山（高い音）や、拍のあたまは強く。つなぎの音は弱く。これだけで、ぐっと自然になるよ。',nxt=True)]))
E.append(LS('D-58',4,'📏','音の長さをかえよう','音の長さでメロディの感じをかえられる',
 mel(2,[[0,67,1],[4,69,1],[8,72,1],[12,69,1],[16,67,1],[20,64,1],[24,67,1],[28,62,1]]),[
 PLAY('音の「長さ」でも、メロディの感じはかわるよ。いまの音は、ぜんぶ短いね。▶ で聴いてみよう。','ぷつぷつ切れて、はずむ感じだね（「スタッカート」というよ）。'),
 S('音の右はしをつかんで、右へドラッグしてのばそう。4つ以上の音を、のばしてね。',tg='#escroll',rs='#grid .nt',ev='notes',need='function(){return !!openClip&&openClip.notes.filter(function(n){return n.l>=3}).length>=4}',ok='音がのびたね。'),
 PLAY('▶ で聴こう。','なめらかにつながったね！ これを「レガート」というよ。'),
 S('短い音は元気で軽く、長い音はなめらかでやさしい。曲の場面によって使い分けよう。',nxt=True)]))
E.append(LS('D-59',4,'🧲','リズムをそろえよう（クオンタイズ）','ずれた音をきれいにそろえられる',
 "function(){vReset();qz=1;try{$('qzQ').querySelector('b').textContent=qzName()}catch(e){}melPre(2,[[0.4,67,3],[4.5,69,3],[7.7,72,3],[12.4,69,3],[16.5,67,3],[20.3,64,3],[24.6,67,3],[28.4,62,3]])();setTool('sel')}",[
 PLAY('手で弾いたり打ち込んだりすると、音のタイミングが少しずれることがあるよ。ピアノロールの音が、マスの線からずれているね。▶ で聴いてみよう。','少しもたついて聞こえたかな？'),
 S('ずれた音を、いちばん近いマスの線にそろえる機能が「クオンタイズ」。上の「編集」メニューから「クオンタイズ」をえらぼう。（キーボードなら Q キー）',tg='#menu',ev='quant',on="function(){if(openClip)selClip=openClip}",need='function(){return !!openClip&&openClip.notes.every(function(n){return Math.abs(n.s-Math.round(n.s))<1e-6})}',ok='ピタッとそろったね！'),
 PLAY('▶ で聴こう。','リズムがきっちりしたね。'),
 S('「1/16」は、どれくらい細かいマスにそろえるかの設定。人間らしいゆらぎを残したいときは、クオンタイズしなくてもいいよ。',tg='#qzQ',nxt=True)]))
# --- F コード (ch5)
CC=chord(0,[60,64,67])
F.append(LS('D-60',5,'🌗','メジャーとマイナー','明るいコードと切ないコードを作り分けられる',
 mel(2,CC),[
 PLAY('このコードは「ド・ミ・ソ」。明るい響きの「メジャー」コードだよ。▶ で聴いてみよう。','明るい感じだね。'),
 S('2小節めに、真ん中の「ミ」を半音下の「ミ♭」にしたコードを置こう。ド・ミ♭・ソ を、2小節めの同じ位置に置いてね。',tg='#escroll',rs='#grid .nt',gs='pts',pts='[[16,60],[16,63],[16,67]]',ev='notes',need='function(){return nAll([[16,60],[16,63],[16,67]])}',ok='音が1つ下がっただけだよ。'),
 PLAY('▶ で、1小節めと2小節めを聴きくらべよう。','明るい → 切ない。これが「メジャー」と「マイナー」のちがいだよ。'),
 S('真ん中の音を半音下げると、メジャー（明るい）がマイナー（切ない）になる。コード名では「C」が「Cm」と書かれるよ。',nxt=True)]))
F.append(LS('D-61',5,'🍸','7thコード','コードにもう1音足しておしゃれにできる',
 mel(2,CC),[
 PLAY('ふつうの「C」コードを用意したよ。▶ で聴いてみよう。','すっきりした、基本の響きだね。'),
 S('「シ」を1つ足してみよう。ソのさらに上の「シ」を、同じ位置に置いてね。',tg='#escroll',rs='#grid .nt',gs='pts',pts='[[0,71]]',ev='notes',need='function(){return nHas(0,71)}',ok='「Cmaj7（シーメジャーセブンス）」になったよ。'),
 S('2小節めには「G7（ジーセブンス）」を置こう。レ・ファ・ソ・シ（下から）の4つを、2小節めの同じ位置に置いてね。',tg='#escroll',rs='#grid .nt',gs='pts',pts='[[16,62],[16,65],[16,67],[16,71]]',ev='notes',need='function(){return nAll([[16,62],[16,65],[16,67],[16,71]])}',ok='4つの音がそろったね。'),
 PLAY('▶ で聴こう。','おしゃれで、大人っぽい響きになったね。'),
 S('3つの音に、もう1つ足したのが「7th（セブンス）」。ジャズや、おしゃれな曲でよく使われるよ。',nxt=True)]))
F.append(LS('D-62',5,'🔄','コードの転回（ひっくり返す）','コードの音を並べかえてなめらかにつなげられる',
 mel(4,chord(0,[60,64,67])+chord(16,[65,69,72])+chord(32,[60,64,67])),[
 PLAY('1小節めは C、2小節めは F。つないで聴いてみよう。','2小節めで、音が上にポンと跳ぶ感じがするね。'),
 S('コードの音を並べかえることを「転回」というよ。音の位置を近くすると、なめらかにつながるんだ。',tg='#escroll',nxt=True),
 S('4小節めに、「ド」を残して並べかえた F を置こう。ド・ファ・ラ（下から）を、4小節めの同じ位置に置いてね。',tg='#escroll',rs='#grid .nt',gs='pts',pts='[[48,60],[48,65],[48,69]]',ev='notes',need='function(){return nAll([[48,60],[48,65],[48,69]])}',ok='並べかえたFが置けたね。'),
 PLAY('▶ で聴こう。3小節め → 4小節めに注目！','C から F へ、音がほとんど動かない。なめらかにつながったね。'),
 S('「ド」を共通で残すと、ほかの音は少ししか動かない。転回のいちばんの使いみちは、コードをなめらかにつなぐことだよ。',nxt=True)]))
# --- H つなげて1曲 (ch7)
H.append(LS('D-63',7,'🧩','楽器の役割を知ろう','4つの楽器の役割が分かる',"mixPre(null,0,1)",[
 S('いま4つのトラックが鳴っているよ。ドラムはリズム、ベースは低い土台、コードは中くらいの高さで厚みを出す役、メロディは高くて主役。役割がちがうから、ぶつからずに1曲になるんだ。',nxt=True),
 PLAY('▶ を押してから、次に進もう。曲を鳴らしたままでOK！','4つの役割が重なっているね。'),
 S('「ベース」の「M（ミュート）」を押してみよう。',tg="#mxs .cs[data-i=\"2\"] .mb b[data-k=\"mute\"]",rs="#mxs .cs[data-i=\"2\"] .mb b[data-k=\"mute\"]",ev='mute',need='function(a){return a.on&&a.i===2}',ok='低い土台がぬけて、音が軽く、ふわふわしたね。'),
 S('もう一度「M」を押して、もどそう。',tg="#mxs .cs[data-i=\"2\"] .mb b[data-k=\"mute\"]",rs="#mxs .cs[data-i=\"2\"] .mb b[data-k=\"mute\"]",ev='mute',need='function(a){return !a.on}',ok='ベースがもどったね。'),
 S('こんどは「メロディ」の「M」を押してみよう。',tg="#mxs .cs[data-i=\"3\"] .mb b[data-k=\"mute\"]",rs="#mxs .cs[data-i=\"3\"] .mb b[data-k=\"mute\"]",ev='mute',need='function(a){return a.on&&a.i===3}',ok='主役がいなくなって、さみしい感じになったね。'),
 S('もう一度「M」を押して、もどそう。',tg="#mxs .cs[data-i=\"3\"] .mb b[data-k=\"mute\"]",rs="#mxs .cs[data-i=\"3\"] .mb b[data-k=\"mute\"]",ev='mute',need='function(a){return !a.on}',ok='メロディがもどったね。'),
 S('どの楽器にも、自分の高さと役目がある。同じ高さで同じことをする楽器が増えると、ごちゃごちゃするよ。曲を作るときは「いまの主役はだれ？」を考えてみよう。',nxt=True)]))
H.append(LS('D-64',7,'🎶','ハモリを足そう','メロディに3度上のハモリを重ねられる',
 mel(2,[[0,60,8],[8,62,8],[16,64,8],[24,67,8]]),[
 PLAY('ひとりで歌っているようなメロディだよ。▶ で聴いてみよう。','すっきりしたメロディだね。'),
 S('同じメロディを、ちがう高さで重ねると「ハモリ」になるよ。音を2つ飛ばした高さ（3度上）に重ねると、きれいにハモる。光っている場所に、4つの音を置いてね。',tg='#escroll',rs='#grid .nt',gs='pts',pts='[[0,64],[8,65],[16,67],[24,71]]',ev='notes',need='function(){return nAll([[0,64],[8,65],[16,67],[24,71]])}',ok='ハモリの音がそろったね。'),
 PLAY('▶ で聴こう。','ふたりで歌っているみたいに、厚みが出たね。'),
 S('ハモリは、メロディが同じ時間に動くときに使うと効果的。サビなど、盛り上げたいところで使ってみよう。',nxt=True)]))
H.append(LS('D-65',7,'🥁','ドラムのフィルで場面を切りかえよう','小節の最後にフィルを入れて場面をかえられる',
 "function(){T=[];vReset();addTrack('ドラム','drum');T[0].clips.push(drumClip(2,true));selClip=null;closeEd();renderTracks();openEd(T[0],T[0].clips[0]);setTool('sel')}",[
 S('ドラムが同じことをくりかえすと、単調に感じるよね。そこで、まとまりの最後だけ「フィル（かざりのドラム）」を入れるよ。次の場面への合図にもなるんだ。',nxt=True),
 PLAY('まず ▶ で、ふつうのドラムを聴いてみよう。','同じパターンが2回続くね。'),
 S('2小節めのいちばん最後に、スネアを3つ足そう。光っている場所（30・31・32番め）をクリックしてね。',tg='#escroll',rs='#grid .nt',gs='tapD',dk='[[29,1],[30,1],[31,1]]',ev='notes',need='function(){return !!openClip&&hasK(openClip,1,29)&&hasK(openClip,1,30)&&hasK(openClip,1,31)}',ok='スネアが連打になったね。'),
 PLAY('▶ で聴こう。','最後のスネアの連打で、「次がはじまる！」という感じがしたね。'),
 S('フィルは、4小節や8小節の最後に入れるのがお約束。曲の流れがはっきりして、聴いている人が飽きにくくなるよ。',nxt=True)],'bars:2,'))
# --- L ループ素材 (ch11)
AU.append(LS('D-66',11,'🔁','ループ素材を並べよう','オーディオのループを並べて曲のもとを作れる',"exAuPre(false)",[
 S('ここからは「オーディオ」。MIDIは音符のデータ、オーディオは「録音された音そのもの」で、波のような形で見えるよ。ドラムのループ素材を用意したよ（出てくるまで、少し待ってね）。',tg='.lane',nxt=True),
 PLAY('▶ で聴いてみよう。','これは2小節ぶんの「ループ素材」。つなげると、ずっと続く音になるよ。'),
 S('上の「📋 ぜんぶ複製」を押して、素材を4小節にのばそう。',tg='#blkBtn',rs='.lane .clip',ev='blk',need='function(a){return a>=4}',ok='4小節になったね。'),
 S('もう1回押して、8小節にしよう。',tg='#blkBtn',rs='.lane .clip',ev='blk',need='function(a){return a>=8}',ok='8小節のリズムができたよ。'),
 PLAY('▶ で、通して聴こう。','素材を並べるだけで、すぐにリズムができたね。'),
 S('自分で1つずつ打ち込むのとはちがう、「サクッと作る」やり方だよ。世の中には、いろいろなループ素材があるんだ。',nxt=True)],'bars:8,blk:1,'))
AU.append(LS('D-67',11,'🎹','ループにメロディを重ねよう','ループの上に自分のメロディをのせられる',"exAuPre(true)",[
 S('2小節のループが4回ならんだ、8小節のトラックを用意したよ。この上に、メロディを重ねてみよう。',tg='.lane',nxt=True),
 PLAY('まず ▶ で、ループだけを聴いてみよう。','ドラムのループだね。ここに音を足していくよ。'),
 S('下の「メロディ」のピアノロールで、色がついた段だけを使って、音を4つ以上置いてみてね。',tg='#escroll',rs='#grid .nt',ev='notes',need='function(){return !!openClip&&openClip.notes.length>=4}',ok='メロディが置けたね。'),
 PLAY('▶ で聴こう。','ループの上にメロディがのると、もう1曲みたいだね。'),
 S('オーディオ（ループ素材）と、MIDI（自分で打ち込む音）を組み合わせるのが、いちばん早く曲を作る方法だよ。自分の好きな素材は「スタジオ（自由につくる画面）」に読みこめるよ。',nxt=True)],'bars:8,guide:1,'))
# --- M 書き出し (ch12)
EX.append(LS('D-68',12,'💾','曲を保存しよう','作った曲を保存して、あとで続きから作れる',mel(2,[[0,67],[4,69],[8,72],[12,69]]),[
 S('曲ができたら、「保存」しておこう。保存すると、あとでまた続きから作れるよ。',nxt=True),
 S('上の「ファイル」メニューから「プロジェクトを保存」をえらぼう。（キーボードなら Ctrl+S ／ ⌘+S）',tg='#menu',ev='saved',ok='保存のファイルができたよ（ダウンロードのフォルダを見てね）。'),
 S('この保存ファイルは、あとで「プロジェクトを開く」から読みこめるよ。スタジオ（自由につくる画面）の曲は、ログインしていれば、アカウントにも自動で保存されるよ。',nxt=True)]))
EX.append(LS('D-69',12,'📤','MIDIで書き出そう','MIDIファイルとして曲を書き出せる',mel(2,[[0,67],[4,69],[8,72],[12,69],[16,67],[20,64],[24,67],[28,60]]),[
 S('MIDIは、「どの高さの音を、いつ、どれくらい鳴らすか」を書いたデータ。音そのものではないから軽くて、あとから音色を変えられるよ。',nxt=True),
 S('右上の「MIDI書き出し」を押そう。',tg='#midiBtn',rs='#midiBtn',ev='midiOut',ok='.mid のファイルができたよ。'),
 S('ダウンロードした .mid ファイルは、ほかのDAW（事業所の Fender Studio Pro など）にドラッグすれば開けて、好きな楽器の音で鳴らせるよ。音そのものとして書き出すのは、本物のDAWでやってみよう。',nxt=True)]))
# ---------- 3) 挿入 ----------
# 章：スケール章の次に「E 音をいきいきさせよう」を入れ、末尾に L / M を足す
i=s.index('var LES=['); j=s.index('\nvar waiting=null')
blk=s[i:j]
blk2=re.sub(r"ch:(\d+),ic:",lambda m:"ch:%d,ic:"%(int(m.group(1))+(1 if int(m.group(1))>=4 else 0)),blk)
s=s[:i]+blk2+s[j:]
rep("{n:'D',t:'メロディを広げよう（スケール）',c:'#5c7cfa'},","{n:'D',t:'メロディを広げよう（スケール）',c:'#5c7cfa'},{n:'E',t:'音をいきいきさせよう',c:'#ff922b'},")
rep("{n:'J',t:'ジャンルを知ろう',c:'#8bd450'}]","{n:'J',t:'ジャンルを知ろう',c:'#8bd450'},{n:'K',t:'ループ素材でサクッと作ろう',c:'#20c997'},{n:'L',t:'書き出して持ち出そう',c:'#adb5bd'}]")
rep("{id:'D-16',ch:5,",",\n".join(E)+",\n{id:'D-16',ch:5,")
rep("{id:'D-19',ch:6,",",\n".join(F)+",\n{id:'D-19',ch:6,")
rep("{id:'D-24',ch:7,",",\n".join(H)+",\n{id:'D-24',ch:7,")
rep("]}];\nvar waiting=null","]},\n"+",\n".join(AU+EX)+"];\nvar waiting=null")
print('ex_daw ok',len(E),len(F),len(H),len(AU),len(EX))
