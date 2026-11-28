# TAC BASE の音源を「正規のインストゥルメント」にする（tac_add.py のあとに使う）
# - ブラウザの「インストゥルメント」は TAC の楽器だけ（種類ごとに見出し）。前の音（シンセ）は一覧から消す
# - スタジオ・お題で新しく作るトラックは、アップライトピアノ／DISTKIT が最初の音
# - 前の音で作った曲はそのまま鳴る（音色の欄には「前の音」として残る）
# - デイリーのお題の「楽器」の条件は、楽器の種類（のびる音・はじいた音 など）で判定
# 使い方: python3 _dev/tools/tac2_add.py [ファイル...]（省略時は preview/index.html）
import sys,json
FILES=sys.argv[1:] or ['preview/index.html']
MARK='/*tac-main*/'
FAM={'UprightKW':'piano','FMElectricPiano':'piano','FrenchHarpsichord':'piano','DrawbarOrgan':'pad',
 'SoloViolin':'pad','ViolaSection':'pad','CelloSection':'pad','FrenchHorn':'pad','ChromaticHarmonica':'pad',
 'SoloViolinPizz':'pluck','ViolaSectionPizz':'pluck','CelloSectionPizz':'pluck','SoloViolinSpic':'pluck','ViolaSectionSpic':'pluck','CelloSectionSpic':'pluck',
 'ConcertHarp':'pluck','NylonGuitar':'pluck','SteelAcousticGuitar':'pluck','CleanElectricGuitar':'pluck','TenorUkulele':'pluck',
 'TenorSax':'lead','ConcertTrumpet':'lead','ConcertFlute':'lead','Clarinet':'lead','SoloOboe':'lead','TenorTrombone':'lead','MinorStabA':'lead',
 'Glockenspiel':'bell','SoftVibraphone':'bell','Marimba':'bell',
 'FingerBassYR':'bass','SoloContrabass':'bass','SoloContrabassPizz':'bass','SoloContrabassSpic':'bass','SoloBassoon':'bass'}
# ブラウザでの見出し（並び順）
GRP=[('🎹 けんばん','piano'),('🎻 のびる音（弦・オルガン・ホルン）','pad'),('🪕 はじく音（ギター・ハープ・ピチカート）','pluck'),('🎺 メロディの楽器（管楽器）','lead'),('🔔 きらきら（たたく鍵盤）','bell'),('🎸 ベース（低い音）','bass')]
JS=r"""/*tac-main*/
var TACFAM=__FAM__,TACGRP=__GRP__;
function tacFam(k){k=k||'piano';return k.indexOf('tac:')===0?(TACFAM[k.slice(4)]||''):k}
function tacBrw(l){var h=function(t){var e=document.createElement('div');e.className='bn tacH';e.textContent=t;l.appendChild(e)},it=function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))};
  TACGRP.forEach(function(g){h(g[0]);TACIL.forEach(function(d){if(d[0].indexOf('tac:')===0&&TACFAM[d[0].slice(4)]===g[1])it(d)})});h('🥁 ドラム');TACIL.forEach(function(d){if(d[0].indexOf('tkit')===0)it(d)})}
"""
CSS=".tacH{font-weight:800;font-size:12px;opacity:.85;margin:10px 2px 2px;padding:0;background:none;border:0}"
R=[
 # ブラウザ：インストゥルメント＝TACの楽器、別にあった「録音の楽器」の欄はなくす
 ("function(l){INSTL.forEach(function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))})}],"
  "['録音の楽器','本物の楽器・ドラムの音（TAC BASE）','<span style=font-size:22px>🎻</span>',function(l){TACIL.forEach(function(d){l.appendChild(bi(d[3]+' '+d[1],d[2],[['▶','きいてみる',function(){prevInst(d[0])}],['＋ 追加','トラックを作る',function(){addInst(d[0])},1]]))})}],",
  "function(l){tacBrw(l)}],"),
 ("function prevInst(id){","__JS__function prevInst(id){"),
 # 音色の欄：TACの楽器。前の音は、いま使っているときだけ「前の音」として出す
 ("var cur=t.inst||'piano',opts=INSTL.filter(function(x){return x[0].indexOf('kit')!==0}).concat(TACIL.filter(function(x){return x[0].indexOf('tac:')===0}),ZKI.filter(",
  "var cur=t.inst||'piano',opts=INSTL.filter(function(x){return x[0].indexOf('kit')!==0&&x[0]===cur}).map(function(x){return [x[0],x[1]+'（前の音）',x[2],x[3]]}).concat(TACIL.filter(function(x){return x[0].indexOf('tac:')===0}),ZKI.filter("),
 # キット：前のキットは、いま使っているときだけ出す
 ("K.value=t.tk!=null?'t'+t.tk:String(t.kit||0);",
  "[].slice.call(K.options).forEach(function(o){if(o.value.charAt(0)!=='t'){if(t.tk!=null||String(t.kit||0)!==o.value)o.remove();else o.textContent+='（前の音）'}});K.value=t.tk!=null?'t'+t.tk:String(t.kit||0);"),
 # スタジオ・お題で作るトラックの最初の音
 ("function addTrack(name,kd){T.push({name:name||(kd==='drum'?'ドラム':'メロディ'),kind:kd||'inst',c:COLS[T.length%COLS.length],clips:[]});",
  "function addTrack(name,kd){T.push({name:name||(kd==='drum'?'ドラム':'メロディ'),kind:kd||'inst',c:COLS[T.length%COLS.length],clips:[]});if(free){var nt0=T[T.length-1];if(nt0.kind==='drum'){nt0.tk=0;tacKit(0).catch(tacFail)}else{nt0.inst='tac:UprightKW';tacLoad('UprightKW').catch(tacFail)}}"),
 # お題の判定：楽器の種類で
 ("mel=inb.filter(function(n){return !n.d&&n.t.inst!=='bass'}),bs=inb.filter(function(n){return !n.d&&n.t.inst==='bass'});",
  "mel=inb.filter(function(n){return !n.d&&tacFam(n.t.inst)!=='bass'}),bs=inb.filter(function(n){return !n.d&&tacFam(n.t.inst)==='bass'});"),
 ("case 'inst':return T.some(function(t){if(t.kind==='drum')return false;var k=t.inst||'piano';return k===c.k&&",
  "case 'inst':return T.some(function(t){if(t.kind==='drum')return false;var k=t.inst||'piano';return tacFam(k)===c.k&&"),
]
# 親ページ：お題の条件の文
P=[("dcC('inst',{k:'pad',label:'パッド（ふんわりした音）をつかう'})","dcC('inst',{k:'pad',label:'のびる音（バイオリン・オルガンなど）をつかう'})"),
   ("desc:'しずかで、音がすくない子守歌。ふんわりしたパッドの音で。'","desc:'しずかで、音がすくない子守歌。バイオリンやオルガンの、のびる音で。'"),
   ("dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'})","dcC('inst',{k:'bell',label:'きらきらした音（グロッケン・ビブラフォン・マリンバ）をつかう'})"),
   ("dcC('inst',{k:'pluck',label:'プラック（はじいた音）をつかう'})","dcC('inst',{k:'pluck',label:'はじく音（ギター・ハープ・ウクレレなど）をつかう'})"),
   ("dcC('inst',{k:'lead',label:'リード（ピコピコ音）をつかう'})","dcC('inst',{k:'lead',label:'メロディの楽器（サックス・トランペット・フルートなど）をつかう'})"),
   ("desc:'ピコピコしたシンセで、ロボットがおどる曲。'","desc:'元気なメロディの楽器で、ロボットがおどる曲。'")]
js=JS.replace('__FAM__',json.dumps(FAM)).replace('__GRP__',json.dumps(GRP,ensure_ascii=False))
enc=json.dumps(js,ensure_ascii=False)[1:-1].replace('</','<\\/').replace('\n','\\n')
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    if '/*tac-sampler*/' not in s:sys.exit(f+': tac_add.py を先に')
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:60]))
        s=s.replace(o,n.replace('__JS__',enc))
    for o,n in P:
        c=s.count(o)
        if c<1:sys.exit('%s: parent count %d for %r'%(f,c,o[:60]))
        s=s.replace(o,n)
    # 見出しのCSS（DAWの style の先頭に足す）
    o='<style>';i=s.find('var DAW_HTML=');j=s.find(o,i)
    s=s[:j]+o+CSS+s[j+len(o):]
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
