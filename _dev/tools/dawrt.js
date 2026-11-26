// DAW編「自由につくる」の往復テスト：曲を作る → プロジェクト保存・MIDI書き出し → 読み込み直し → 1音ずつ比べる
// 使い方：作業フォルダで  node dawrt.js [幅] [高さ]   （http://localhost:8765/ でリポジトリを配信しておく：python3 -m http.server 8765）
// 結果：OK / NG の一覧。out.mid・proj.json・dawrt.png を作業フォルダに出す
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');const {execFileSync}=require('child_process');const path=require('path');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,OUT=process.cwd();
const res=[];const ok=(name,cond,info)=>{res.push([cond?'OK':'NG',name,info||''])};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext({viewport:{width:W,height:H},acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1500);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);const box=await fh.boundingBox();
await E("startFree()");await pg.waitForTimeout(800);
// 4小節：ドラム・ベース・メロディ・コード（C→G→Am→F。となりのコードに同じ音がある）
await E(`(function(){T=[];addTrack('ドラム','drum');T[0].clips.push(drumClip(4,true));
addTrack('ベース');T[1].clips.push({s:0,l:4,notes:[{s:0,p:36,l:16},{s:16,p:43,l:16},{s:32,p:45,l:16},{s:48,p:41,l:16}]});
addTrack('メロディ');T[2].clips.push({s:0,l:4,notes:[{s:0,p:64,l:4},{s:4,p:67,l:4},{s:8,p:69,l:4},{s:12,p:72,l:4},{s:20,p:71,l:2},{s:60,p:60,l:4}]});
addTrack('コード');T[3].clips.push({s:0,l:4,notes:mkN(chordNotes())});setBpm(128,1);renderTracks();afterEdit()})()`);
await pg.waitForTimeout(400);
// 実際のマウス操作：鉛筆でクリック → 音が1つ増える／消しゴムでクリック → 消える／矢印でダブルクリック → 増える
await E("openEd(T[2],T[2].clips[0]);$('escroll').scrollTop=Math.max(0,(P_HI-66)*RH)");await pg.waitForTimeout(400);
const at=async(step,pitch)=>JSON.parse(await E(`(function(){var g=$('grid').getBoundingClientRect();return JSON.stringify([g.left+cw*${step}+cw/2,g.top+(P_HI-${pitch}+.5)*RH])})()`));
const cntN=async()=>+await E("T[2].clips[0].notes.length");
const has=async(s,p)=>await E(`T[2].clips[0].notes.some(function(n){return n.s===${s}&&n.p===${p}})`);
let q,n0;
await E("setTool('pen')");n0=await cntN();q=await at(40,62);await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(300);
ok('鉛筆のクリックで音が置ける',(await cntN())===n0+1&&await has(40,62),n0+'→'+await cntN());
n0=await cntN();q=await at(44,62);await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(250);await pg.mouse.click(box.x+q[0]+cw2(),box.y+q[1]).catch(()=>{});
function cw2(){return 0}
await pg.waitForTimeout(500);ok('鉛筆で同じ場所を素早く2回押しても消えない（1つ置ける）',await has(44,62),n0+'→'+await cntN());
q=await at(52,62);{const q2=await at(56,62);await pg.waitForTimeout(500);await pg.mouse.move(box.x+q[0],box.y+q[1]);await pg.mouse.down();await pg.mouse.move(box.x+q2[0],box.y+q2[1],{steps:6});await pg.mouse.up();await pg.waitForTimeout(300);
const L=+await E("(function(){var n=T[2].clips[0].notes.filter(function(n){return n.s===52&&n.p===62})[0];return n?n.l:-1})()");ok('鉛筆でなぞると長い音が置ける',L>=4,'長さ '+L)}
await E("setTool('er')");await pg.waitForTimeout(500);n0=await cntN();q=await at(40,62);await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(300);
ok('消しゴムのクリックで音が消える',(await cntN())===n0-1&&!(await has(40,62)),n0+'→'+await cntN());
await E("setTool('sel')");await pg.waitForTimeout(500);n0=await cntN();q=await at(48,62);await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(300);
ok('矢印のクリック1回では音は増えない',(await cntN())===n0,n0+'→'+await cntN());
await pg.waitForTimeout(600);await pg.mouse.dblclick(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(300);
ok('矢印のダブルクリックで音が置ける',(await cntN())===n0+1&&await has(48,62),n0+'→'+await cntN());
await E("closeEd()");
const snap="JSON.stringify({bpm:bpm,T:T.map(function(t){return{name:t.name,kind:t.kind,notes:t.clips.reduce(function(a,c){return a.concat(c.notes.map(function(n){return [c.s*16+n.s,n.p,n.l]}))},[]).sort(function(x,y){return x[0]-y[0]||x[1]-y[1]})}})})";
const model=JSON.parse(await E(snap));fs.writeFileSync(OUT+'/model.json',JSON.stringify(model));
// MIDI書き出し
const [d1]=await Promise.all([pg.waitForEvent('download',{timeout:8000}).catch(()=>null),fr.evaluate(()=>document.getElementById('midiBtn').click())]);
ok('MIDIが書き出される',!!d1);
if(d1){await d1.saveAs(OUT+'/out.mid');const m=JSON.parse(execFileSync('python3',[path.join(__dirname,'mid.py'),OUT+'/out.mid']).toString());
  ok('MIDI：トラック数（テンポ用＋楽器）',m.ntr===model.T.length+1,m.ntr);
  ok('MIDI：テンポ',m.tracks[0].tempo.length&&Math.abs(m.tracks[0].tempo[0][1]-model.bpm)<.1,JSON.stringify(m.tracks[0].tempo));
  const DR=[36,38,42,46,39];
  model.T.forEach((t,i)=>{const mt=m.tracks[i+1]||{notes:[],bad:[],name:''};
    const want=t.notes.map(n=>[n[0]*120,t.kind==='drum'?DR[n[1]]:n[1],Math.max(30,Math.round(n[2]*120))]).map(x=>x.join(',')).sort();
    const got=mt.notes.map(n=>[n[0],n[1],n[2]].join(',')).sort();
    const miss=want.filter(x=>!got.includes(x)),extra=got.filter(x=>!want.includes(x));
    ok('MIDI：'+t.name+' の音が全部一致（'+want.length+'音）',!miss.length&&!extra.length&&!mt.bad.length,(miss.length?'足りない '+miss.slice(0,4).join(' / '):'')+(extra.length?' 余分 '+extra.slice(0,4).join(' / '):'')+(mt.bad.length?' 異常 '+JSON.stringify(mt.bad.slice(0,3)):''));
    ok('MIDI：'+t.name+' のトラック名',mt.name===t.name,JSON.stringify(mt.name));
    ok('MIDI：'+t.name+' のチャンネル',t.kind==='drum'?mt.notes.every(n=>n[3]===9):mt.notes.every(n=>n[3]!==9),'')})}
// プロジェクト保存 → 読み込み直し
const [d2]=await Promise.all([pg.waitForEvent('download',{timeout:8000}).catch(()=>null),E("saveProject()")]);
ok('プロジェクトが保存される',!!d2);
if(d2){await d2.saveAs(OUT+'/proj.json');await E("T=[];renderTracks()");await fr.setInputFiles('#fileIn',OUT+'/proj.json');await pg.waitForTimeout(800);
  const m2=JSON.parse(await E(snap));ok('プロジェクト：読み込み直して全部一致',JSON.stringify(m2)===JSON.stringify(model),'トラック'+m2.T.length+' BPM'+m2.bpm)}
await pg.screenshot({path:OUT+'/dawrt.png'});
ok('ページエラー0件',!errs.length,errs.join(' | '));
res.forEach(r=>console.log(r[0]+'  '+r[1]+(r[2]!==''?'  ('+r[2]+')':'')));
console.log(res.some(r=>r[0]==='NG')?'結果：NG あり':'結果：すべてOK');await b.close()})();
