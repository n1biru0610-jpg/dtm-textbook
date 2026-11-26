const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const i=await p.evaluate(()=>L.findIndex(l=>l.id==='2-7'));await p.evaluate(i=>startLesson(i),i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1200);const fe=await p.$('#f');const fr=await fe.contentFrame();fr.on||0;
await fr.evaluate(()=>{window.__e=[];addEventListener('error',e=>__e.push(e.message))});
await fr.evaluate(()=>{document.getElementById('next').disabled=false;document.getElementById('next').click()});await p.waitForTimeout(600);
const off=await fe.boundingBox();const tap=async(x,y)=>touch?p.touchscreen.tap(off.x+x,off.y+y):p.mouse.click(off.x+x,off.y+y);
const box=async sel=>fr.evaluate(sel=>{const e=document.querySelector(sel);e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]},sel);
// 1つまちがえて置く
const c0=await fr.evaluate(()=>{const e=document.querySelectorAll('.cells.snare .cell')[1];const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});await tap(...c0);await p.waitForTimeout(400);
for(let r=0;r<6;r++){
 const en=await fr.evaluate(()=>!document.getElementById('next').disabled);if(en){console.log('進めた r=',r);break}
 await tap(...await box('#hint'));await p.waitForTimeout(300);
 const st=await fr.evaluate(()=>({line:document.getElementById('line').textContent,h:document.querySelectorAll('.cell.hint').length,x:document.querySelectorAll('.cell.extra').length}));console.log(r,JSON.stringify(st));
 if(r===1)await p.screenshot({path:'h27_'+W+'.png'});
 await p.waitForTimeout(3500);
 const pts=await fr.evaluate(()=>[...document.querySelectorAll('.cell.extra,.cell.hint')].map(e=>{const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}));
 for(const q of pts){await tap(...q);await p.waitForTimeout(250)}
}
await tap(...await box('#play'));await p.waitForTimeout(6000);
console.log('final next enabled',await fr.evaluate(()=>!document.getElementById('next').disabled),await fr.evaluate(()=>document.getElementById('line').textContent));
console.log('errors',errs,await fr.evaluate(()=>__e));await b.close()})();
