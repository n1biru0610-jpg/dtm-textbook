// 3-7：①5つの音 ②リズム ③くりかえし ④さいごはド を実クリックで満たして進めるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const i=await p.evaluate(()=>L.findIndex(l=>l.id==='3-7'));await p.evaluate(i=>startLesson(i),i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1200);const fe=await p.$('#f');const fr=await fe.contentFrame();const off=await fe.boundingBox();
const tap=async(x,y)=>touch?p.touchscreen.tap(off.x+x,off.y+y):p.mouse.click(off.x+x,off.y+y);
const at=async(sel,n)=>{const q=await fr.evaluate(([sel,n])=>{let e;if(Array.isArray(n)){const R=['ド','ラ','ソ','ミ','レ','ド'];const a=[...document.querySelectorAll(sel)].filter(x=>x.getAttribute('aria-label')===R[n[1]]+' '+(n[0]+1));e=n[1]===5?a[a.length-1]:a[0]}else e=n==null?document.querySelector(sel):document.querySelectorAll(sel)[n];e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();const h=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return[r.left+r.width/2,r.top+r.height/2,h===e||e.contains(h)]},[sel,n]);if(!q[2])console.log('隠れている',sel,n);await tap(q[0],q[1]);await p.waitForTimeout(200)};
const put=[[0,3],[1,4],[2,3],[3,2],[8,3],[9,4],[10,3],[11,2],[6,2],[15,5]];
for(const cr of put)await at('.mc',cr);
await at('[data-k=play]');
for(let w=0;w<60&&await fr.evaluate(()=>document.getElementById('next').disabled);w++)await p.waitForTimeout(400);
console.log(W,H,'next enabled',await fr.evaluate(()=>!document.getElementById('next').disabled),await fr.evaluate(()=>[...document.querySelectorAll('#chk > *')].map(e=>e.textContent+(e.classList.contains('ok')?'✓':'✗')).join(' ')),JSON.stringify(await fr.evaluate(()=>window.__mel&&__mel.get().g)));
await p.screenshot({path:'t37_'+W+'.png'});
console.log('errors',errs);await b.close()})();
