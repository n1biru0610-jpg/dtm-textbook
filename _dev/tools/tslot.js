// スロット型レッスン：正しい答えを「パレット→四角」の実クリックで置いて、▶ で進めるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
const PLAN=process.argv[5]==='b'?{'5-2':[[0,2,3,1]],'5-3':[{pal:[0,1,2]},[0,1,2,3]],'5-4':[{tog:[0,2,4]}],'6-2':[[0,2]],'6-3':[[0,1,2,1,3]],'6-4':['play']}:{'4-3':[[0,1,2,3],'play',[0,2,3,1]],'4-4':['A','B',[0,2,1,0]],'4-5':[[0,2,1,0]]};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
for(const id of Object.keys(PLAN)){
const i=await p.evaluate(id=>L.findIndex(l=>l.id===id),id);await p.evaluate(i=>startLesson(i),i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1200);const fe=await p.$('#f');const fr=await fe.contentFrame();const off=await fe.boundingBox();
const tap=async(x,y)=>touch?p.touchscreen.tap(off.x+x,off.y+y):p.mouse.click(off.x+x,off.y+y);
const at=async(sel,n)=>{const q=await fr.evaluate(([sel,n])=>{const e=n==null?document.querySelector(sel):document.querySelector(sel).children[n];e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();const h=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return[r.left+r.width/2,r.top+r.height/2,h===e||e.contains(h)]},[sel,n]);if(!q[2])console.log(id,'隠れている',sel,n);await tap(q[0],q[1]);await p.waitForTimeout(250)};
const en=()=>fr.evaluate(()=>!document.getElementById('next').disabled);
let st=0;for(const a of PLAN[id]){st++;
 if(Array.isArray(a)){for(let s=0;s<a.length;s++){await at('#pal',a[s]);await at('#slots',s)}await p.waitForTimeout(300);
  if(await en()){}else{await at('[data-k=play]');for(let w=0;w<90&&!(await en());w++)await p.waitForTimeout(400)}}
 else if(a.pal){for(const v of a.pal){await at('#pal',v);await p.waitForTimeout(2500)}}
 else if(a.tog){for(const v of a.tog)await at('#slots',v);await at('[data-k=play]');for(let w=0;w<90&&!(await en());w++)await p.waitForTimeout(400)}
 else{await at('[data-k='+a+']');for(let w=0;w<90;w++){await p.waitForTimeout(400);if(a==='A'&&w>8)break;if(await en())break}if(a==='A')continue}
 const ok=await en();console.log(id,'step',st,ok?'OK':'進めず',(await fr.evaluate(()=>document.getElementById('line').textContent)).slice(0,60),JSON.stringify(await fr.evaluate(()=>window.__sg&&__sg.get().g)));
 await fr.evaluate(()=>{document.getElementById('next').disabled=false;document.getElementById('next').click()});await p.waitForTimeout(600)}
}
console.log('errors',errs);await b.close()})();
