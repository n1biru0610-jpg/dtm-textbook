const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.evaluate(()=>{const b=document.querySelector('[data-o="g"]');b&&b.click()});await p.waitForTimeout(2500);
for(const f of p.frames()){try{const el=await f.$('text=フェーダー / ゲイン');if(el){await el.click();await p.waitForTimeout(800)}}catch(e){}}
let found=false;for(const f of p.frames()){try{const t=await f.evaluate(()=>document.body.innerText);if(t.includes('-10dBくらい'))found=true}catch(e){}}
const t=await p.evaluate(()=>document.body.innerText.includes('-10dBくらい'));
console.log('found',found||t,'errors',errs);await p.screenshot({path:'gl.png'});await b.close()})();
