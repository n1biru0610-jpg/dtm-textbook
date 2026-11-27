const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const pg=await b.newPage({viewport:{width:1366,height:768}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase|googleapis|gstatic/,r=>r.abort());await pg.goto('file:///home/claude/dtm-textbook/preview/index.html');await pg.waitForTimeout(2500);await pg.click('#fgs').catch(()=>{});await pg.waitForTimeout(800);
console.log(JSON.stringify(await pg.evaluate(()=>({n:L.length,ids:L.map(l=>l.id).slice(6,12),ch2:CH[1].ids.join(','),g:GOAL['2-9'],qz:!!QZ['2-8']&&!!QZ['2-9'],ic:!!META['2-9']}))));
for(const id of ['2-8','2-9']){
 const idx=await pg.evaluate(i=>L.map(l=>l.id).indexOf(i),id);await pg.evaluate(i=>{startLesson(i)},idx);await pg.waitForTimeout(1200);
 for(let k=0;k<6;k++){const on=await pg.evaluate(()=>document.getElementById('intro').classList.contains('on'));if(on){await pg.mouse.click(683,384);await pg.waitForTimeout(800)}else break}
 await pg.waitForTimeout(1500);
 let t=null;for(let w=0;w<8&&!t;w++){for(const f of pg.frames()){try{const h=await f.evaluate(()=>document.querySelector('header')&&document.querySelector('header').textContent);if(h&&h.includes(id))t=f}catch(e){}}if(!t)await pg.waitForTimeout(800)}
 console.log(id,'frame',!!t);
 // fill: 目標どおりに置く
 const setT=async(goalName)=>t.evaluate(g=>{var gg=eval(g);KEYS.forEach(function(k){for(var j=0;j<8;j++)T[k][j]=gg[k][j]?1:0});refresh();gate()},goalName);
 // gate() は IIFE内。T,goal は内部変数のため、セルを直接クリックして検証
 const click=async(k,j)=>t.evaluate(([k,j])=>{document.querySelectorAll('.cells.'+k+' .cell')[j].click()},[k,j]);
 const state=async()=>t.evaluate(()=>({ok:!document.getElementById('next').disabled,line:document.getElementById('line').textContent.slice(0,16)}));
 const goalOf=(id,step)=>({'2-8':[{kick:[0,3,4],snare:[2,6],hat:[0,1,2,3,4,5,6,7]},{kick:[0,3,4,7],snare:[2,6],hat:[0,1,2,3,4,5,6,7]}],'2-9':[{kick:[0,4],snare:[2,6],hat:[0,2,3,4,6,7]},{kick:[0,3,4],snare:[2,6],hat:[0,2,4,6]}]})[id][step];
 for(let step=0;step<2;step++){
  const g=goalOf(id,step);
  for(const k of ['kick','snare','hat']){for(let j=0;j<8;j++){const on=await t.evaluate(([k,j])=>document.querySelectorAll('.cells.'+k+' .cell')[j].classList.contains('on'),[k,j]);const want=g[k].includes(j);if(on!==want)await click(k,j)}}
  await pg.waitForTimeout(400);const s=await state();console.log(id,'step',step,'clear',s.ok);
  await t.evaluate(()=>document.getElementById('next').click());await pg.waitForTimeout(300)}
 console.log(id,'last go',await t.evaluate(()=>getComputedStyle(document.getElementById('go')).display));
 await t.evaluate(()=>document.getElementById('go').click());await pg.waitForTimeout(900);
 console.log(id,'quiz',(await pg.evaluate(()=>document.body.innerText)).match(/と」|休符/)?'ok':'none');
 await pg.screenshot({path:`bs_${id}.png`});await pg.evaluate(()=>{try{openHome(false)}catch(e){}});await pg.waitForTimeout(500)}
console.log('errs',errs);await b.close()})()
