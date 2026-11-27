// 初心者になったつもりで、DAW編を実際のマウス操作で最後まで通す
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file:///tmp/w/dawt3.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
const log=[];const only=process.argv[2]?process.argv[2].split(','):null;
const total=await E("LES.length");
async function rectOf(sel){return p.evaluate(sel=>{var l=sel.split(',').map(function(x){return x.trim()}).filter(Boolean);for(var i=0;i<l.length;i++){var e;try{e=document.querySelector(l[i])}catch(x){continue}if(e&&e.offsetParent!==null){var r=e.getBoundingClientRect();if(r.width>0&&r.height>0)return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,l:r.left,t:r.top,sel:l[i]}}}return null},sel)}
async function cardRect(){return p.evaluate(()=>{var e=document.getElementById('coach');if(!e||!e.classList.contains('on'))return null;var r=e.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom}})}
function overlap(a,c){return a&&c&&a.x>c.l&&a.x<c.r&&a.y>c.t&&a.y<c.b}
async function gridPt(s,pit,drum){const m=await E(`({row:${drum?`DL.length-1-${pit}`:`P_HI-${pit}`},cw:cw,RH:RH})`);return p.evaluate(([s,m])=>{var g=document.getElementById('grid'),r=g.getBoundingClientRect(),sc=document.getElementById('escroll').getBoundingClientRect();var x=r.left+s*m.cw+m.cw*.5,y=r.top+m.row*m.RH+m.RH/2;return {x:x,y:y,vis:x>sc.left+4&&x<sc.right-4&&y>sc.top+4&&y<sc.bottom-4}},[s,m])}
async function ensureVisible(pt,drum,pit){const m=await E(`({row:${drum?`DL.length-1-${pit}`:`P_HI-${pit}`},RH:RH})`);return p.evaluate(m=>{var e=document.getElementById('escroll');e.scrollTop=Math.max(0,m.row*m.RH-e.clientHeight/2);return 1},m)}
async function stepState(){return E("({stp:stp,cur:cur,conf:confirming,wait:!!waiting,nx:$('cnext').style.display!=='none',fin:$('fin').classList.contains('on')})")}
async function waitAdv(from,ms){const t0=Date.now();while(Date.now()-t0<ms){const s=await stepState();if(s.conf||s.stp!==from.stp||s.fin||s.cur!==from.cur)return true;await p.waitForTimeout(120)}return false}
const mclick=async(pt)=>{await p.mouse.move(pt.x,pt.y);await p.mouse.click(pt.x,pt.y)};
let lessonsDone=0;
async function playLesson(idx){
 const L=await E(`({id:LES[${idx}].id,t:LES[${idx}].t,n:LES[${idx}].steps.length,ch:CHS[LES[${idx}].ch].t})`);
 const rec={id:L.id,title:L.t,ch:L.ch,steps:[],t0:Date.now()};
 await E(`startLesson(${idx})`);await p.waitForTimeout(1200);
 for(let q=0;q<6;q++){const on=await E("document.getElementById('chap').className");if(/on/.test(on)){rec.chapIntro=(rec.chapIntro||0)+1;await p.mouse.click(683,384);await p.waitForTimeout(500)}}
 // イントロ（レッスン名の紹介）が消えるまで
 await p.waitForTimeout(4500);
 for(let guard=0;guard<40;guard++){
  let st=await stepState();if(st.fin)break;
  const info=await E("(function(){var s=LES[cur].steps[stp];if(!s)return null;return {say:s.say,tg:s.tg||'',ev:s.ev||'',gs:s.gs||'',pts:s.pts?(typeof s.pts==='function'?s.pts():s.pts):null,dk:s.dk||null,next:!!s.next}})()");
  if(!info)break;
  const sr={stp:st.stp,len:info.say.length,ev:info.ev,say:info.say.slice(0,40),notes:[]};rec.steps.push(sr);
  const t1=Date.now();
  const card=await cardRect();
  if(info.next&&!st.conf){await p.waitForTimeout(600);const c=await rectOf('#cnext');if(c){await mclick(c)}else sr.notes.push('つぎへ無し')}
  else{
   const tgr=info.tg?await rectOf(info.tg):null;
   if(info.tg&&!tgr)sr.notes.push('対象が見つからない:'+info.tg.slice(0,30));
   if(tgr&&overlap(tgr,card))sr.notes.push('説明カードが対象を隠している');
   let ok=false;
   const attempt=async(fn,label)=>{if(ok)return;try{await fn()}catch(e){sr.notes.push('例外:'+label+String(e).slice(0,60))}ok=await waitAdv(st,1600);if(ok&&label!=='main')sr.notes.push('最初の操作では進まず、'+label+'で進んだ')};
   const ev=info.ev;
   const placeNotes=async()=>{
     const drum=await E("isD(curTrack())");let pts=info.pts,dk=info.dk;
     let list=[];
     if(dk){let a=typeof dk==='string'?eval(dk):dk;list=a.map(x=>({s:x[0],p:x[1],d:true}))}
     else if(pts){list=pts.map(x=>({s:x[0],p:x[1],d:false}))}
     else if(drum){const row=/キック/.test(info.say.slice(0,12))?0:/スネア/.test(info.say.slice(0,12))?1:/ハイハット/.test(info.say.slice(0,14))?2:0;
       const ss=row===0?[0,4,8,12]:row===1?[4,12]:[0,2,4,6,8,10,12,14];list=ss.map(x=>({s:x,p:row,d:true}));sr.notes.push('ドラムはヒント無し（文章の指示だけで打つ）')}
     else{ // ヒント無し：色のついた段から選ぶ
       const rows=await E("(function(){var a=[];for(var q=60;q<=72;q++)if(!guide||inG(q))a.push(q);return a})()");
       const seq=[0,4,8,12,16,20,24,28];list=seq.map((s,i)=>({s:s,p:rows[(i*2)%rows.length],d:drum}));sr.notes.push('ヒント無し：自分で音を選ぶ')}
     for(const it of list){
       let pt=await gridPt(it.s,it.p,it.d);
       if(!pt.vis){await ensureVisible(pt,it.d,it.p);sr.notes.push('ヒントの位置が画面の外（スクロールが必要）');pt=await gridPt(it.s,it.p,it.d)}
       if(pt.vis){const cd=await cardRect();if(overlap(pt,cd))sr.notes.push('説明カードが打ち込み位置を隠している');await mclick(pt)}else sr.notes.push('位置が画面に入らない');
       await p.waitForTimeout(150);
       const s2=await stepState();if(s2.conf)break}
   };
   const clickTg=async()=>{const r=tgr||await rectOf(info.tg);if(!r)throw 'none';await mclick(r)};
   if(ev==='played'){await attempt(async()=>{const r=await rectOf('#play');await mclick(r)},'main')}
   else if(ev==='notes'){await attempt(placeNotes,'main')}
   else if(ev==='keyPress'){await attempt(async()=>{for(let k=0;k<7;k++){const r=await p.evaluate(k=>{var e=document.querySelectorAll('.pk')[k+8];if(!e)return null;var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}},k);if(r)await mclick(r);await p.waitForTimeout(120)}},'main')}
   else if(ev==='tempo'){await attempt(async()=>{const r=await rectOf(/＋/.test(info.say)?'#bp':'#bm');await p.mouse.move(r.x,r.y);await p.mouse.down();await p.waitForTimeout(3500);await p.mouse.up()},'main')}
   else if(ev==='noteSel'){await attempt(async()=>{const r=await p.evaluate(()=>{var e=document.querySelector('#grid .nt');var r=e.getBoundingClientRect();return {x:r.left+r.width*.4,y:r.top+r.height/2}});await mclick(r)},'main')}
   else if(ev==='velSet'){await attempt(async()=>{
       const times=info.say.includes('3つ以上')?3:1;
       for(let k=0;k<times;k++){
         const r=await p.evaluate(k=>{var a=document.querySelectorAll('#grid .nt');var e=a[1+k*2]||a[0];var r=e.getBoundingClientRect();return {x:r.left+r.width*.4,y:r.top+r.height/2}},k);await mclick(r);
         const q=await rectOf('#qzV');await mclick(q);await p.waitForTimeout(250);
         const it=await p.evaluate(()=>{var b=[].filter.call(document.querySelectorAll('#ctxm button'),function(x){return x.offsetParent!==null&&x.textContent.indexOf('弱')>=0})[0];if(!b)return null;var r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});
         if(it)await mclick(it);else sr.notes.push('つよさメニューが開かない');await p.waitForTimeout(250)}},'main')}
   else if(ev==='quant'){await attempt(async()=>{const m=await p.evaluate(()=>{var e=[].filter.call(document.querySelectorAll('#menu span'),function(x){return x.textContent.trim()==='編集'})[0];var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});await mclick(m);await p.waitForTimeout(300);
       const it=await p.evaluate(()=>{var b=[].filter.call(document.querySelectorAll('#ctxm button'),function(x){return x.offsetParent!==null&&x.textContent.indexOf('クオンタイズ')>=0})[0];if(!b)return null;var r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});if(it)await mclick(it);else sr.notes.push('編集メニューにクオンタイズが見つからない')},'main')}
   else if(ev==='saved'){await attempt(async()=>{const m=await p.evaluate(()=>{var e=[].filter.call(document.querySelectorAll('#menu span'),function(x){return x.textContent.trim()==='ファイル'})[0];var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});await mclick(m);await p.waitForTimeout(300);
       const it=await p.evaluate(()=>{var b=[].filter.call(document.querySelectorAll('#ctxm button'),function(x){return x.offsetParent!==null&&x.textContent.indexOf('プロジェクトを保存')>=0})[0];if(!b)return null;var r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});if(it)await mclick(it);else sr.notes.push('ファイルメニューに保存が見つからない')},'main')}
   else{
     await attempt(clickTg,'main');
     if(!ok){await attempt(async()=>{const r=await rectOf(info.tg);if(r){await p.mouse.dblclick(r.x,r.y)}},'ダブルクリック')}
     if(!ok){await attempt(async()=>{const r=await rectOf(info.tg);if(r){await p.mouse.move(r.x,r.y);await p.mouse.down();await p.mouse.move(r.x+70,r.y,{steps:8});await p.mouse.up()}},'ドラッグ')}
   }
   if(!ok){ // どうしても進めない：記録して強制的に進める
     sr.stuck=true;await E("waiting&&confirmStep(waiting)");await p.waitForTimeout(300)}
   // 確認表示 → 「つぎへ」
   await p.waitForTimeout(500);const c=await rectOf('#cnext');if(c)await mclick(c);
  }
  sr.ms=Date.now()-t1;
  await p.waitForTimeout(700);
 }
 // 終了画面
 await p.waitForTimeout(800);
 const fin=await E("({fin:$('fin').classList.contains('on'),done:!!done[LES[cur].id],ft:$('ft').textContent})");
 rec.finished=fin.fin&&fin.done;rec.sec=Math.round((Date.now()-rec.t0)/1000);
 if(!rec.finished)rec.notes='終了画面に届かず';
 log.push(rec);
 const stuck=rec.steps.filter(s=>s.stuck).length,warn=rec.steps.filter(s=>s.notes.length).length;
 console.log(rec.id,rec.title,'|',rec.finished?'クリア':'未クリア','| steps',rec.steps.length,'stuck',stuck,'warn',warn,'|',rec.sec+'s');
 await p.screenshot({path:`play/${rec.id}_end.png`});
 fs.writeFileSync('play/log.json',JSON.stringify(log,null,1));
}
const ids=await E("LES.map(function(l){return l.id})");
for(let i=0;i<ids.length;i++){if(only&&!only.includes(ids[i]))continue;
  // 終了画面を閉じる
  await E("$('fin').classList.remove('on')");
  try{await playLesson(i)}catch(e){console.log(ids[i],'ERROR',String(e).slice(0,120));log.push({id:ids[i],error:String(e)});fs.writeFileSync('play/log.json',JSON.stringify(log,null,1))}}
console.log('errs',errs.slice(0,5));await b.close()})()
