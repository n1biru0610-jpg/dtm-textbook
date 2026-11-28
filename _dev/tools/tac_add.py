# TAC BASE のサンプラー音源（録音の楽器 27 ＋ 弦の奏法 8）とドラム 5 キットを DAW（スタジオ・お題の両方）に追加する。
# 素材は リポジトリ直下 tac/inst（FLAC＋定義JSON）と tac/drums（WAV）。使うときだけ読みこむ。
# 使い方: python3 _dev/tools/tac_add.py [ファイル...]（省略時は preview/index.html）
import sys,json
FILES=sys.argv[1:] or ['preview/index.html']
MARK='/*tac-sampler*/'
# id, 名前, ひとこと, アイコン, トラック名, オクターブ（ピアノロールの位置合わせ）
I=[
('UprightKW','アップライトピアノ','本物のピアノの音（録音）','🎹','ピアノ',0),
('FMElectricPiano','FMエレクトリックピアノ','きらっとした、80年代のエレピ','🎹','エレピ',0),
('FrenchHarpsichord','チェンバロ','バロック音楽の、はじく鍵盤','🎹','チェンバロ',0),
('DrawbarOrgan','オルガン','のびる、あたたかい鍵盤','🎹','オルガン',0),
('SoloViolin','バイオリン','高くて歌うような弦','🎻','バイオリン',0),
('SoloViolinPizz','バイオリン（ピチカート）','弦を指ではじく音','🎻','バイオリン',0),
('SoloViolinSpic','バイオリン（スピッカート）','弓をはねさせる、短い音','🎻','バイオリン',0),
('ViolaSection','ビオラ','バイオリンより少し低い弦','🎻','ビオラ',0),
('ViolaSectionPizz','ビオラ（ピチカート）','弦を指ではじく音','🎻','ビオラ',0),
('ViolaSectionSpic','ビオラ（スピッカート）','弓をはねさせる、短い音','🎻','ビオラ',0),
('CelloSection','チェロ','ひくくて深い弦','🎻','チェロ',-1),
('CelloSectionPizz','チェロ（ピチカート）','弦を指ではじく音','🎻','チェロ',-1),
('CelloSectionSpic','チェロ（スピッカート）','弓をはねさせる、短い音','🎻','チェロ',-1),
('SoloContrabass','コントラバス','いちばん低い弦','🎻','コントラバス',-1),
('SoloContrabassPizz','コントラバス（ピチカート）','ジャズのベースのような音','🎻','コントラバス',-1),
('SoloContrabassSpic','コントラバス（スピッカート）','弓をはねさせる、短い音','🎻','コントラバス',-1),
('ConcertHarp','ハープ','やさしく、はじく弦','🪕','ハープ',0),
('NylonGuitar','クラシックギター','やわらかいナイロン弦','🎸','ギター',0),
('SteelAcousticGuitar','アコースティックギター','明るい鉄の弦','🎸','アコギ',0),
('CleanElectricGuitar','エレキギター（クリーン）','すんだエレキの音','🎸','エレキ',0),
('TenorUkulele','ウクレレ','かるくて明るい音','🪕','ウクレレ',0),
('FingerBassYR','エレキベース','指で弾く、土台の音','🎸','ベース',-2),
('ConcertFlute','フルート','やわらかい笛の音','🪈','フルート',0),
('Clarinet','クラリネット','まるい木の笛','🎷','クラリネット',0),
('SoloOboe','オーボエ','少し鼻にかかった笛','🎷','オーボエ',0),
('SoloBassoon','ファゴット','ひくい木の笛','🎷','ファゴット',-1),
('TenorSax','テナーサックス','ジャズで人気の笛','🎷','サックス',0),
('ChromaticHarmonica','ハーモニカ','息でならす小さな楽器','🎵','ハーモニカ',0),
('ConcertTrumpet','トランペット','明るく、はなやかな金管','🎺','トランペット',0),
('FrenchHorn','ホルン','やわらかく、ひろがる金管','📯','ホルン',0),
('TenorTrombone','トロンボーン','ひくめで太い金管','🎺','トロンボーン',-1),
('Marimba','マリンバ','木をたたく、ころころした音','🎶','マリンバ',0),
('SoftVibraphone','ビブラフォン','ゆれる、金属の鍵盤','🎶','ビブラフォン',0),
('Glockenspiel','グロッケン','高くて、きらきら','🔔','グロッケン',1),
('MinorStabA','マイナースタブ','ハウス系の、短いコードの音','⚡','スタブ',0),
]
K=[{"kick": "kick.wav", "snare": "snare.wav", "clap": "clap.wav", "hatclsd": "hatclsd.wav", "hatopen": "hatopen.wav", "lotom": "lotom.wav", "midtom": "midtom.wav", "hitom": "hitom.wav", "crash": "crash.wav", "ride": "ride.wav", "claves": "claves.wav", "cowbell": "cowbell.wav"}, {"kick": "sdbkit-kick.wav", "snare": "sdbkit-snare.wav", "clap": "sdbkit-clap.wav", "hatclsd": "sdbkit-hatclsd.wav", "hatopen": "sdbkit-hatopen.wav", "lotom": "sdbkit-lotom.wav", "midtom": "sdbkit-midtom.wav", "hitom": "sdbkit-hitom.wav", "crash": "crash.wav", "ride": "ride.wav", "claves": "claves.wav", "cowbell": "cowbell.wav"}, {"kick": "synthkit-kick.wav", "snare": "synthkit-snare.wav", "clap": "synthkit-clap.wav", "hatclsd": "synthkit-hatclsd.wav", "hatopen": "synthkit-hatopen.wav", "lotom": "synthkit-lotom.wav", "midtom": "synthkit-midtom.wav", "hitom": "synthkit-hitom.wav", "crash": "synthkit-crash.wav", "ride": "synthkit-ride.wav", "claves": "claves.wav", "cowbell": "cowbell.wav"}, {"kick": "x0xproc1-kick.wav", "snare": "x0xproc1-snare.wav", "clap": "x0xproc1-clap.wav", "hatclsd": "x0xproc1-hatclsd.wav", "hatopen": "x0xproc1-hatopen.wav", "lotom": "x0xproc1-lotom.wav", "midtom": "x0xproc1-midtom.wav", "hitom": "x0xproc1-hitom.wav", "crash": "x0xproc1-crash.wav", "ride": "x0xproc1-ride.wav", "claves": "claves.wav", "cowbell": "cowbell.wav"}, {"kick": "x0xproc2-kick.wav", "snare": "x0xproc2-snare.wav", "clap": "x0xproc2-clap.wav", "hatclsd": "x0xproc2-hatclsd.wav", "hatopen": "x0xproc2-hatopen.wav", "lotom": "x0xproc2-lotom.wav", "midtom": "x0xproc2-midtom.wav", "hitom": "x0xproc2-hitom.wav", "crash": "x0xproc2-cymbal.wav", "ride": "ride.wav", "claves": "x0xproc2-claves.wav", "cowbell": "x0xproc2-cowbell.wav"}]
KN=["DISTKIT", "SDBKIT", "SYNTHKIT", "X0X PROC 1", "X0X PROC 2"]
RNG={"MinorStabA": [0, 127], "UprightKW": [21, 108], "SoloViolin": [55, 96], "CelloSection": [36, 77], "ViolaSection": [48, 86], "SoloContrabass": [28, 59], "FMElectricPiano": [27, 98], "FingerBassYR": [26, 45], "CleanElectricGuitar": [35, 86], "NylonGuitar": [35, 84], "DrawbarOrgan": [33, 98], "ConcertTrumpet": [53, 84], "FrenchHorn": [36, 74], "TenorSax": [38, 90], "ConcertHarp": [35, 86], "Clarinet": [50, 86], "Marimba": [41, 96], "SteelAcousticGuitar": [40, 84], "TenorUkulele": [60, 84], "Glockenspiel": [79, 108], "SoftVibraphone": [53, 88], "FrenchHarpsichord": [36, 84], "ConcertFlute": [60, 96], "SoloOboe": [58, 89], "SoloBassoon": [34, 72], "TenorTrombone": [39, 65], "ChromaticHarmonica": [48, 96], "SoloViolinPizz": [55, 81], "SoloViolinSpic": [55, 96], "CelloSectionPizz": [36, 77], "CelloSectionSpic": [36, 71], "ViolaSectionPizz": [48, 86], "ViolaSectionSpic": [48, 86], "SoloContrabassPizz": [28, 45], "SoloContrabassSpic": [28, 59]}
# ピアノロール（C3〜C6あたり）に音域の中心がくるようにオクターブを決める
def _oct(a):
    lo,hi=RNG[a];best=None
    for o in [0,-1,1,-2,2]:
        cov=max(0,min(hi,72+12*o)-max(lo,60+12*o)+1)
        if best is None or cov>best[0]:best=(cov,o)
    return best[1]
OV={'CelloSection':-1,'CelloSectionPizz':-1,'CelloSectionSpic':-1,'SoloBassoon':-1}
I=[(a,b,c_,d,e,OV.get(a,_oct(a))) for a,b,c_,d,e,f in I]
import os
TRIM=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'tac_trim.json'))) if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),'tac_trim.json')) else {}
# ドラムの段（DL16）→ TAC のパッド名
PM={0:'kick',1:'snare',2:'hatclsd',3:'hatopen',4:'clap',5:'hitom',6:'lotom',7:'ride',8:'crash',10:'claves',14:'cowbell',15:'midtom'}
KD=['パンチのある、ひずんだ音','バンドのような生ドラム','電子音のドラム','リズムマシン風（1）','リズムマシン風（2）']
TACIL=[['tac:'+a,b,c,d,e,f,TRIM.get(a,1)] for a,b,c,d,e,f in I]+[['tkit%d'%i,'ドラム '+KN[i],KD[i],'🥁','ドラム',0] for i in range(5)]
JS=r"""/*tac-sampler*/
var TACIL=__TACIL__,TACK=__TACK__,TACPM=__TACPM__,TACIN={},TACD={},TACBUF={},TACP={},CURV=null,TACOH={},TACW=0;
TACIL.forEach(function(x){if(x[0].indexOf('tac:')===0){TACIN[x[0]]=1;INST[x[0]]=function(m,t,d){tacNote(x[0].slice(4),m,t,d,x[6])}}});
var TACB=(function(){var h='';try{h=parent.location.href}catch(e){}if(!h||h.indexOf('http')!==0)h=location.href;h=h.split('#')[0].split('?')[0];if(!/github\.io|localhost|127\.0\.0\.1/.test(h))return 'https://n1biru0610-jpg.github.io/dtm-textbook/tac/';h=h.replace(/\/preview\/[^\/]*$/,'/').replace(/\/[^\/]*$/,'/');return h+'tac/'})();
function tacAB(u){if(!TACP[u])TACP[u]=fetch(u).then(function(r){if(!r.ok)throw r.status;return r.arrayBuffer()}).then(function(a){init();return new Promise(function(res,rej){ctx.decodeAudioData(a,res,rej)})}).then(function(b){TACBUF[u]=b;return b}).catch(function(e){delete TACP[u];throw e});return TACP[u]}
function tacDb(x){return Math.pow(10,(+x||0)/20)}
function tacLoad(id){var o=TACD[id];if(o)return o.p;o=TACD[id]={ok:false};
  o.p=fetch(TACB+'inst/'+id+'.json').then(function(r){if(!r.ok)throw r.status;return r.json()}).then(function(d){var df=d.defaults||{},R=[];
    (d.groups||[]).forEach(function(g){(g.regions||[]).forEach(function(r){var f=d.samples[r.sample];if(!f)return;var env=Object.assign({},df.ampEnv||{},g.ampEnv||{},r.ampEnv||{});
      R.push({u:TACB+'inst/'+f,lo:r.loKey==null?0:r.loKey,hi:r.hiKey==null?127:r.hiKey,lv:r.loVel==null?1:r.loVel,hv:r.hiVel==null?127:r.hiVel,root:r.rootKey==null?60:r.rootKey,
        tune:(+r.coarseTune||0)+(+r.fineTune||0)/100,kt:(r.keyTracking==null?100:+r.keyTracking)/100,g:tacDb(d.gainDb)*tacDb(g.gainDb)*tacDb(r.gainDb),pan:+r.pan||0,
        mode:r.mode||g.mode||df.mode||'gate',a:+env.attack||0,dc:+env.decay||0,su:env.sustain==null?1:+env.sustain,rel:env.release==null?.05:+env.release})})});
    o.R=R;return Promise.all(R.map(function(x){return tacAB(x.u)}))}).then(function(){o.ok=true;return o}).catch(function(e){delete TACD[id];throw e});return o.p}
function tacKit(k){var o=TACD['kit'+k];if(o)return o.p;o=TACD['kit'+k]={ok:false};var m=TACK[k]||{};o.p=Promise.all(Object.keys(m).map(function(p){return tacAB(TACB+'drums/'+m[p])})).then(function(){o.ok=true;return o}).catch(function(e){delete TACD['kit'+k];throw e});return o.p}
function tacWait(){if(Date.now()-TACW<4000)return;TACW=Date.now();try{toast('楽器の音を読みこみ中だよ。少し待ってね')}catch(e){}}
function tacNote(id,m,t,d,tr){var o=TACD[id];if(!o||!o.ok){tacLoad(id).catch(function(){});tacWait();return}
  var vel=Math.max(1,Math.min(127,Math.round(127*(CURV==null?100/127:CURV)))),hit=0;
  o.R.forEach(function(r){if(m<r.lo||m>r.hi||vel<r.lv||vel>r.hv)return;var b=TACBUF[r.u];if(!b)return;hit=1;
    var s=ctx.createBufferSource(),g=ctx.createGain(),rate=Math.pow(2,((m-r.root)*r.kt+r.tune)/12),pk=r.g*.9*(tr||1),end;s.buffer=b;s.playbackRate.value=rate;
    var at=Math.max(.002,r.a);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+at);if(r.dc>0)g.gain.setTargetAtTime(pk*r.su,t+at,r.dc/3);
    if(r.mode==='oneShot'){end=t+b.duration/rate}else{var off=t+Math.max(d,at+.01);g.gain.cancelScheduledValues(off);g.gain.setValueAtTime(r.dc>0?pk*r.su:pk,off);g.gain.setTargetAtTime(0,off,Math.max(.01,r.rel)/4);end=Math.min(off+r.rel*1.5+.05,t+b.duration/rate)}
    var nd=g;if(r.pan&&ctx.createStereoPanner){var pn=ctx.createStereoPanner();pn.pan.value=r.pan;g.connect(pn);nd=pn}s.connect(g);nd.connect(OUT||master);s.start(t);try{s.stop(end+.02)}catch(e){}})}
function tacDrum(tr,p,t,pd){var k=tr.tk|0,nm=TACPM[p],f=nm&&(TACK[k]||{})[nm];if(!f)return false;var u=TACB+'drums/'+f,b=TACBUF[u];if(!b){tacKit(k).catch(function(){});tacWait();return true}
  var s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.value=.85*(pd&&pd.v!==undefined?pd.v:1);s.playbackRate.value=Math.pow(2,((pd&&pd.pt)||0)/12);s.connect(g);g.connect(OUT||master);s.start(t);
  var ck=tr.id+'|'+k;if(nm==='hatclsd'||nm==='hatopen'){var q=TACOH[ck];if(q){try{q.g.gain.setTargetAtTime(0,t,.01);q.s.stop(t+.06)}catch(e){}}TACOH[ck]=nm==='hatopen'?{s:s,g:g}:null}return true}
function tacPrev(id){var tk=id.indexOf('tkit')===0,pr=tk?tacKit(+id.slice(4)):tacLoad(id.slice(4));var ok=TACD[tk?'kit'+id.slice(4):id.slice(4)];if(!ok||!ok.ok)try{toast('音を読みこみ中…')}catch(e){}
  pr.then(function(){init();ctx.resume();var t0=ctx.currentTime+.05;OUT=null;if(tk){var fake={tk:+id.slice(4),id:'prev'};[0,2,1,2,0,2,1,3].forEach(function(p,i){tacDrum(fake,p,t0+i*.16)})}
    else{var x=TACIL.filter(function(y){return y[0]===id})[0],o=((x&&x[5])||0)*12;[60,64,67,72].forEach(function(n,i){tacNote(id.slice(4),n+o,t0+i*.22,.3,x&&x[6])})}}).catch(function(){try{toast('楽器の音を読みこめなかったよ。インターネットを確認してね')}catch(e){}})}
function tacScan(){try{(T||[]).forEach(function(t){if(t.inst&&TACIN[t.inst])tacLoad(t.inst.slice(4)).catch(function(){tacFail()});if(t.tk!=null)tacKit(t.tk|0).catch(function(){tacFail()})})}catch(e){}}
function tacFail(){if(Date.now()-(tacFail.t||0)<15000)return;tacFail.t=Date.now();try{toast('楽器の音を読みこめなかったよ。インターネットを確認してね')}catch(e){}}
setInterval(tacScan,1500);
"""
R=[("if(b){playSmp(b,t,pd);return}if(!f)return;","if(b){playSmp(b,t,pd);return}if(tr&&tr.tk!=null&&tacDrum(tr,p,t,pd))return;if(!f)return;"),
   ("['kit1','ドラム（エレクトロ）','太いキックの、機械的な音','🥁','ドラム']];","['kit1','ドラム（エレクトロ）','太いキックの、機械的な音','🥁','ドラム']];\\n__JS__"),
   ("function addInst(id){var d=INSTL.concat(ZKI).filter(","function addInst(id){var d=INSTL.concat(ZKI,TACIL).filter("),
   ("var dr=id.indexOf('kit')===0;addTrack(d[4],dr?'drum':'inst');var t=T[T.length-1];if(dr)t.kit=+id.slice(3);else if(id!=='piano')t.inst=id;",
    "var tk=id.indexOf('tkit')===0,dr=id.indexOf('kit')===0||tk;addTrack(d[4],dr?'drum':'inst');var t=T[T.length-1];if(tk){t.kit=0;t.tk=+id.slice(4);tacKit(t.tk).then(function(){toast('「'+d[1]+'」の音を読みこんだよ')}).catch(tacFail)}else if(dr)t.kit=+id.slice(3);else if(id!=='piano'){t.inst=id;if(d[5])t.oct=d[5];if(TACIN[id])tacLoad(id.slice(4)).then(function(){toast('「'+d[1]+'」の音を読みこんだよ')}).catch(tacFail)}"),
   ("function prevInst(id){init();ctx.resume();","function prevInst(id){if(id.indexOf('tac:')===0||id.indexOf('tkit')===0){tacPrev(id);return}init();ctx.resume();"),
   ("function(l){INSTL.forEach(function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))})}],",
    "function(l){INSTL.forEach(function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))})}],"
    "['録音の楽器','本物の楽器・ドラムの音（TAC BASE）','<span style=font-size:22px>🎻</span>',function(l){TACIL.forEach(function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))})}],"),
   ("else tone(n.p+(t.oct||0)*12,nextT+off,(c.sw?swW(c,n.s+n.l)-ns:n.l)*sd()*.95*(t.len||1),t.inst);OUT=O0}",
    "else{CURV=n.v==null?null:n.v;tone(n.p+(t.oct||0)*12,nextT+off,(c.sw?swW(c,n.s+n.l)-ns:n.l)*sd()*.95*(t.len||1),t.inst);CURV=null}OUT=O0}"),
   ("INSTL.filter(function(x){return x[0].indexOf('kit')!==0}).concat(ZKI.filter(","INSTL.filter(function(x){return x[0].indexOf('kit')!==0}).concat(TACIL.filter(function(x){return x[0].indexOf('tac:')===0}),ZKI.filter("),
   ("if(kd==='drum')o.kit=t.kit===1?1:0;else if(ok.indexOf(t.inst)>0)o.inst=t.inst;","if(kd==='drum'){o.kit=t.kit===1?1:0;if(t.tk>=0&&t.tk<=4)o.tk=t.tk|0}else if(ok.indexOf(t.inst)>0||TACIN[t.inst])o.inst=t.inst;"),
   ("<option value=\\\"1\\\">エレクトロ<\\/option><\\/select>","<option value=\\\"1\\\">エレクトロ<\\/option>__KOPT__<\\/select>"),
   ("var K=d.querySelector('#isK');K.value=String(t.kit||0);K.onchange=function(){t.kit=+this.value;afterEdit();",
    "var K=d.querySelector('#isK');K.value=t.tk!=null?'t'+t.tk:String(t.kit||0);K.onchange=function(){var v=this.value;if(v.charAt(0)==='t'){t.kit=0;t.tk=+v.slice(1);tacKit(t.tk).catch(tacFail)}else{delete t.tk;t.kit=+v}afterEdit();"),
]
js=JS.replace('__TACIL__',json.dumps(TACIL,ensure_ascii=False)).replace('__TACK__',json.dumps(K,ensure_ascii=False)).replace('__TACPM__',json.dumps({str(k):v for k,v in PM.items()}))
KOPT=''.join('<option value=\\"t%d\\">%s<\\/option>'%(i,KN[i]) for i in range(5))
enc=json.dumps(js,ensure_ascii=False)[1:-1].replace('</','<\\/')
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:60]))
        s=s.replace(o,n.replace('__JS__',enc).replace('__KOPT__',KOPT))
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
