const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const pg=await b.newPage({viewport:{width:1366,height:768}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase|googleapis|gstatic/,r=>r.abort());await pg.goto('file:///home/claude/dtm-textbook/preview/index.html');await pg.waitForTimeout(2500);await pg.click('#fgs').catch(()=>{});await pg.waitForTimeout(800);
const r=await pg.evaluate(()=>({n:L.length,ids:L.map(l=>l.id).slice(16,21),ch3:CH[2].ids.join(','),goal:GOAL['3-8'],qz:!!QZ['3-8'],ic:!!META['3-8']}));
console.log(JSON.stringify(r));
const idx=await pg.evaluate(()=>L.map(l=>l.id).indexOf('3-8'));
await pg.evaluate(i=>{startLesson(i)},idx);await pg.waitForTimeout(1200);for(let k=0;k<6;k++){const on=await pg.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await pg.mouse.click(683,384);await pg.waitForTimeout(800)}else break}await pg.waitForTimeout(1500);
const fr=await (await pg.$('#lf, iframe[title], #lessonFrame')||await pg.$('iframe')).contentFrame();
console.log('frames',pg.frames().length, await pg.evaluate(()=>[...document.querySelectorAll('iframe')].map(f=>f.id+':'+(f.srcdoc||'').slice(0,0)+getComputedStyle(f).display).join(' ')));
const lf=pg.frames().find(f=>f.url().startsWith('about:srcdoc')&&true&&f.name()!=='x');
let t=null;for(const f of pg.frames()){try{const h=await f.evaluate(()=>document.querySelector('header')&&document.querySelector('header').textContent);if(h&&h.includes('3-8'))t=f}catch(e){}}
console.log('lesson frame',!!t);
await t.evaluate(()=>{[0,1,2,3].forEach((c,i)=>__mel.click(i+1,c))});
await t.evaluate(()=>document.querySelector('[data-k=play]').click());await pg.waitForTimeout(3200);
for(const k of ['sj','so','sb']){await t.evaluate(()=>document.getElementById('next').click());await t.evaluate(k=>document.querySelector('[data-k='+k+']').click(),k);await pg.waitForTimeout(3200)}
await t.evaluate(()=>document.getElementById('next').click());await pg.waitForTimeout(500);
await t.evaluate(()=>document.getElementById('go').click());await pg.waitForTimeout(800);
await pg.screenshot({path:'l38_quiz.png'});
console.log('quiz text',(await pg.evaluate(()=>document.body.innerText)).match(/「スケール」ってなに？/)?'ok':'none');
console.log('errs',errs);await b.close()})()
