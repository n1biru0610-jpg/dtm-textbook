// DAW編「自由につくる」で、4小節の曲をマウスとキーボードだけで作る通しテスト（4小節チャレンジ用）
// 使い方：作業フォルダで  node dawfree.js [幅] [高さ] [t=タッチ端末]  （リポジトリ直下で python3 -m http.server 8765 を動かしておく）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,OUT=process.cwd();
const res=[];const ok=(n,c,i)=>{res.push([c?'OK':'NG',n,i===undefined?'':i]);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const MOB=process.argv[4]==='t';const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true,acceptDownloads:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'}:{viewport:{width:W,height:H},acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/net::|Failed to load|ERR_/.test(m.text()))errs.push('console: '+m.text())});
pg.on('dialog',d=>{errs.push('dialog: '+d.message());d.dismiss()});
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);let box=await fh.boundingBox();
const R=async sel=>JSON.parse(await fr.evaluate(s=>{const e=Array.from(document.querySelectorAll(s)).filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=="hidden")[0];if(!e)return "null";const r=e.getBoundingClientRect();return JSON.stringify({x:r.left,y:r.top,w:r.width,h:r.height})},sel));
const click=async(sel,opt)=>{const r=await R(sel);if(!r){ok('見つからない: '+sel,false);return false}
  const cx=r.x+r.w/2,cy=r.y+r.h/2;const hit=await fr.evaluate(([x,y,s])=>{const e=document.elementFromPoint(x,y);const t=document.querySelector(s);return !!(e&&t&&(t===e||t.contains(e)))},[cx,cy,sel]);
  if(!hit)ok('押せない（何かに隠れている）: '+sel,false);await pg.mouse.click(box.x+cx,box.y+cy,opt);await pg.waitForTimeout(250);return hit};
const shot=async n=>pg.screenshot({path:OUT+'/free_'+n+'.png'});
const st=async()=>JSON.parse(await E("JSON.stringify({T:T.map(function(t){return{n:t.name,k:t.kind,c:t.clips.map(function(c){return[c.s,c.l,c.notes?c.notes.length:-1]})}}),bpm:bpm,open:!!openClip,sel:sel,tool:tool,free:free})"));
// 1. マップ → 自由につくる
await click('#dfree');await pg.waitForTimeout(800);let s=await st();
ok('自由につくるが開く',s.free,JSON.stringify(s.T));await shot('1');
// 2. いまあるトラックを全部消して、まっさらから（トラックを選んで Delete では消えない想定なので、右クリックメニューを試す）
// 2. ドラムトラックを追加
const n0=s.T.length;await click('#addT');await click('#kindDrum');await click('#dlgOk');s=await st();
ok('＋ → ドラム → 追加 でトラックが増える',s.T.length===n0+1&&s.T[s.T.length-1].k==='drum',n0+'→'+s.T.length);
const di=s.T.length-1;
// 3. 鉛筆で4小節のクリップを描く
await click('#toolPen');
const lane=async i=>JSON.parse(await E("(function(){var l=document.querySelectorAll('.lane')["+i+"].getBoundingClientRect();return JSON.stringify({x:l.left,y:l.top,h:l.height,bw:bw()})})()"));
let L=await lane(di);
await pg.mouse.move(box.x+L.x+L.bw*0.2,box.y+L.y+L.h/2);await pg.mouse.down();await pg.mouse.move(box.x+L.x+L.bw*3.8,box.y+L.y+L.h/2,{steps:10});await pg.mouse.up();await pg.waitForTimeout(300);
s=await st();ok('鉛筆でなぞると4小節のクリップができる',JSON.stringify(s.T[di].c)==='[[0,4,0]]',JSON.stringify(s.T[di].c));
// 4. 矢印 → ダブルクリックで開く → ドラムを置く（キック 1,5,9,13 / スネア 5,13 / ハイハット 8分）
await click('#toolSel');
const cr=await E("(function(){var c=document.querySelectorAll('.lane')["+di+"].querySelector('.clip').getBoundingClientRect();return JSON.stringify([c.left+c.width*0.1,c.top+c.height/2])})()");const cp=JSON.parse(cr);
await pg.mouse.dblclick(box.x+cp[0],box.y+cp[1]);await pg.waitForTimeout(600);s=await st();ok('ダブルクリックで打ち込み画面が開く',s.open);await shot('4');
const cell=async(step,p)=>JSON.parse(await E("(function(){var g=$('grid').getBoundingClientRect();return JSON.stringify([g.left+cw*"+step+"+cw/2,g.top+(drw("+p+")+.5)*RH])})()"));
const tapCell=async(step,p)=>{const q=await cell(step,p);const vis=await fr.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return !!(e&&e.closest('#grid'))},q);if(!vis){ok('マスが見えない/押せない step'+step+' p'+p,false);return}await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(80)};
for(const c of [0,4,8,12])await tapCell(c,0);for(const c of [4,12])await tapCell(c,1);for(const c of [0,2,4,6,8,10,12,14])await tapCell(c,2);
let notes=JSON.parse(await E("JSON.stringify(T["+di+"].clips[0].notes.map(function(n){return n.p+':'+n.s}).sort())"));
ok('ドラムのマスをクリックで置ける（14音）',notes.length===14,notes.join(' '));
// 同じマスをもう一度押すと消える
await tapCell(14,2);notes=JSON.parse(await E("JSON.stringify(T["+di+"].clips[0].notes.map(function(n){return n.p+':'+n.s}))"));ok('置いたマスをもう一度押すと消える',notes.length===13,notes.length);
await tapCell(14,2);
// 2小節め以降へ横スクロールして置けるか
await E("$('escroll').scrollLeft=cw*16");await pg.waitForTimeout(200);await tapCell(16,0);
ok('横にスクロールして2小節めにも置ける',await E("T["+di+"].clips[0].notes.some(function(n){return n.s===16&&n.p===0})"));
await click('#ecl');s=await st();ok('✕ で打ち込み画面を閉じる',!s.open);
// 5. ブラウザの「＋追加」でピアノのトラック
const n1=s.T.length;if(!(await R('#brw .bi .ad'))){await click('#tabBr');await pg.waitForTimeout(400)}await E("(function(){var b=Array.prototype.filter.call(document.querySelectorAll('#brw .bi'),function(x){return x.getClientRects().length&&/アップライトピアノ/.test(x.textContent.trim())})[0];if(b)b.querySelector('.ad').setAttribute('data-t','1')})()");await click('#brw .bi .ad[data-t]');await pg.waitForTimeout(400);ok('重ねて開いた楽器ブラウザは、＋追加のあと自動で閉じる',!(await E("document.body.classList.contains('brOpen')")));s=await st();ok('楽器ブラウザの「＋追加」でトラックが増える',s.T.length===n1+1,JSON.stringify(s.T[s.T.length-1]));
const pi=s.T.length-1;
// 6. 鉛筆でクリップ → 開いて鉛筆でメロディ
await click('#toolPen');L=await lane(pi);
await pg.mouse.move(box.x+L.x+L.bw*0.2,box.y+L.y+L.h/2);await pg.mouse.down();await pg.mouse.move(box.x+L.x+L.bw*3.8,box.y+L.y+L.h/2,{steps:10});await pg.mouse.up();await pg.waitForTimeout(300);
s=await st();ok('ピアノにも4小節のクリップ',JSON.stringify(s.T[pi].c)==='[[0,4,0]]',JSON.stringify(s.T[pi].c));
const cr2=JSON.parse(await E("(function(){var c=document.querySelectorAll('.lane')["+pi+"].querySelector('.clip').getBoundingClientRect();return JSON.stringify([c.left+c.width*0.1,c.top+c.height/2])})()"));
await pg.mouse.dblclick(box.x+cr2[0],box.y+cr2[1]);await pg.waitForTimeout(600);ok('鉛筆を持ったまま、クリップのダブルクリックで開ける',await E('!!openClip'));if(await R('#toolPen'))await click('#toolPen');if(!MOB)ok('打ち込み画面を開いたまま、鉛筆／矢印を切りかえられる',!!(await R('#toolPen')),'');
const pcell=async(step,p)=>JSON.parse(await E("(function(){var g=$('grid').getBoundingClientRect();return JSON.stringify([g.left+cw*"+step+"+cw/2,g.top+(P_HI-"+p+"+.5)*RH])})()"));
const vis=async q=>fr.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return !!(e&&e.closest('#grid'))},q);
if(MOB)await E("setTool('sel')");const mel=[[0,60],[4,64],[8,67],[12,72]];let bad=0;
for(const [c,p] of mel){await E("(function(){var es=$('escroll');var y=(P_HI-"+p+")*RH;if(y<es.scrollTop+20||y>es.scrollTop+es.clientHeight-40)es.scrollTop=Math.max(0,y-es.clientHeight/2)})()");await pg.waitForTimeout(150);const q=await pcell(c,p);if(!await vis(q)){bad++;console.log('  見えない',c,p,JSON.stringify(q),await E("(function(){var es=$('escroll').getBoundingClientRect(),e=document.elementFromPoint("+q[0]+","+q[1]+");return JSON.stringify({es:[es.top,es.bottom],st:$('escroll').scrollTop,ch:$('escroll').clientHeight,hit:e&&(e.id||e.className),ed:$('editor').getBoundingClientRect().top})})()"));continue}if(MOB)await pg.touchscreen.tap(box.x+q[0],box.y+q[1]);else await pg.mouse.click(box.x+q[0],box.y+q[1]);await pg.waitForTimeout(500)}
notes=JSON.parse(await E("JSON.stringify(T["+pi+"].clips[0].notes.map(function(n){return n.p+':'+n.s+':'+n.l}))"));
ok('ピアノロールで ド・ミ・ソ・ド が置ける（'+(MOB?'タッチ：タップ':'鉛筆クリック')+'）',bad===0&&notes.length===4,'見えない '+bad+' / '+notes.join(' '));await shot('6');
// 7. 元にもどす・やり直す
if(!MOB){await pg.keyboard.press('Control+z');await pg.waitForTimeout(300);let nz=+await E("(T["+pi+"].clips[0]||{notes:[]}).notes.length");
ok('Ctrl+Z で1つもどる',nz===3,nz);
await pg.keyboard.press('Control+y');await pg.waitForTimeout(300);nz=+await E("(T["+pi+"].clips[0]||{notes:[]}).notes.length");ok('Ctrl+Y でやり直す',nz===4,nz);}
s=await st();if(!MOB)ok('打ち込み中に もどす・やり直す をしても、打ち込み画面は開いたまま',s.open,'open='+s.open);
if(s.open)await click('#ecl');
// 8. クリップを選んで複製・削除
await click('#toolSel');const cr3=JSON.parse(await E("(function(){var c=document.querySelectorAll('.lane')["+pi+"].querySelector('.clip').getBoundingClientRect();return JSON.stringify([c.left+c.width*0.1,c.top+c.height/2])})()"));
await pg.mouse.click(box.x+cr3[0],box.y+cr3[1]);await pg.waitForTimeout(200);
await pg.keyboard.press('Control+d');await pg.waitForTimeout(300);s=await st();ok('Ctrl+D でクリップを複製（うしろに並ぶ）',s.T[pi].c.length===2&&s.T[pi].c[1][0]===4,JSON.stringify(s.T[pi].c));
await pg.keyboard.press('Delete');await pg.waitForTimeout(300);s=await st();ok('Delete で選んだクリップを消す',s.T[pi].c.length===1,JSON.stringify(s.T[pi].c));
// 9. テンポ
const b0=s.bpm;await click('#bp');s=await st();ok('テンポの＋',s.bpm===b0+1,b0+'→'+s.bpm);await click('#bm');
// 10. 再生・停止
await click('#play');await pg.waitForTimeout(1500);const pl=JSON.parse(await E("JSON.stringify({p:playing,c:(typeof playPos==='function'?playPos():null),t:$('time').textContent})"));
ok('▶ で再生が始まる',pl.p,JSON.stringify(pl));await click('#stop');ok('■ で止まる',!(await E('playing')));
// 11. マップに戻って、もう一度「自由につくる」→ 続きが残っているか
s=await st();const before=JSON.stringify(s.T);
await click('#mapBtn');await pg.waitForTimeout(600);await click('#dfree');await pg.waitForTimeout(800);s=await st();
ok('マップ→自由につくる で、作っていた曲が残っている',JSON.stringify(s.T)===before,JSON.stringify(s.T).slice(0,160));
// 12. 親の記録（アカウントに保存される場所）に入っているか
await pg.waitForTimeout(2000);const pp=await pg.evaluate(()=>{const p=P();return p&&p.dprojs?JSON.stringify(p.dprojs.map(x=>({n:x.name,t:(x.T||[]).length}))):'なし'});
ok('作った曲が学習記録（プロジェクト一覧）に保存される',pp!=='なし'&&pp!=='[]',pp);
await shot('end');
ok('ページエラー・コンソールエラー0件',!errs.length,errs.slice(0,5).join(' | '));
console.log(res.some(r=>r[0]==='NG')?'結果：NG あり':'結果：すべてOK');await b.close()})();
