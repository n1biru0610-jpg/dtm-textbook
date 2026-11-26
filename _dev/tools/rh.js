const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);
await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.evaluate(()=>openRhythm());await p.waitForTimeout(1500);
const fe=await p.$('#rhf');const fr=await fe.contentFrame();
const n=await fr.evaluate(()=>document.querySelectorAll('.dn').length);const out=[];
for(let i=0;i<n;i++){
 await fr.evaluate(i=>{document.querySelectorAll('.dn')[i].click()},i);await p.waitForTimeout(3200);
 await fr.evaluate(()=>{document.getElementById('intro').click()}).catch(()=>{});await p.waitForTimeout(3200);
 await fr.evaluate(()=>{var c=document.getElementById('chap');if(c.onclick)c.onclick()}).catch(()=>{});await p.waitForTimeout(800);
 const off=await fe.boundingBox();
 const els=await fr.evaluate(()=>Array.from(document.querySelectorAll('#game button, #pad0,#pad1,#pad2')).filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return{n:(e.id||e.className)+':'+e.textContent.trim().slice(0,10),x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,in:r.bottom<=innerHeight&&r.right<=innerWidth&&r.top>=0}}));
 for(const e of els){const t=await p.evaluate(([X,Y])=>{const h=document.elementFromPoint(X,Y);return h?(h.id==='rhf'?'':(h.id||h.className)):'none'},[off.x+e.x,off.y+e.y]);
  if(t||!e.in)out.push(`stage${i} ${e.n} covered-by:${t} inview:${e.in}`)}
 if(i===0)await p.screenshot({path:`rh_${W}.png`});
 // play mode
 await fr.evaluate(()=>{const b=Array.from(document.querySelectorAll('#ready button')).find(b=>/たたく|スタート|あそぶ|やって/.test(b.textContent));if(b)b.click()});await p.waitForTimeout(500);
 if(i===0)await p.screenshot({path:`rh_${W}_play.png`});
 await p.waitForTimeout(300);if(i===0)console.log(els.map(e=>e.n).join(' | '));await fr.evaluate(()=>{const b=Array.from(document.querySelectorAll('#game button')).find(b=>/マップ|もどる/.test(b.textContent));if(b)b.click()});await p.waitForTimeout(800);
}
console.log(out.join('\n'));console.log('errors',errs);await b.close()})();
