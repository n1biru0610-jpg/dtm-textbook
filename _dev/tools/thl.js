const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const W=+process.argv[2]||1366,H=+process.argv[3]||768,touch=process.argv[4]==='t';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const ctx=await b.newContext(touch?{viewport:{width:W,height:H},hasTouch:true,isMobile:true}:{viewport:{width:W,height:H}});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDawC()});await pg.waitForTimeout(1500);
const fr=await (await pg.$('#dawc')).contentFrame();
await fr.evaluate(()=>{const s=document.createElement('style');s.textContent='*{animation:none!important}';document.head.appendChild(s)});
await fr.evaluate(c=>__g(c),`startFree()`);await pg.waitForTimeout(400);
const ids=await pg.evaluate(()=>DCP.map(t=>t.id));let bad=[];
for(let k=0;k<ids.length;k++){
 const th=await pg.evaluate(k=>{const t=DCP[k];return {day:'2030-01-'+('0'+(k+1)).slice(-2),id:t.id,md:'1月'+(k+1)+'日',title:t.title,desc:t.desc,conds:t.c.concat([{t:'bars4',label:DC_BARS}])}},k);
 await fr.evaluate(([c,th])=>__g(c.replace('TH',JSON.stringify(th))),['(function(){chStart(TH);document.getElementById("chm").classList.remove("on");chUI()})()',th]);await pg.waitForTimeout(350);
 const m=await fr.evaluate(()=>{const bar=document.getElementById('chBar');const bs=[...bar.querySelectorAll('button')];const tops=new Set(bs.map(x=>Math.round(x.getBoundingClientRect().top)));const dbg=[...bar.querySelectorAll('.tx')].map(x=>x.textContent+':'+x.scrollWidth+'/'+x.clientWidth).join(' | ');if(window.__d===undefined){};const trunc=[...bar.querySelectorAll('.tx')].filter(x=>x.scrollWidth>x.clientWidth+1).length;const q=document.getElementById('chIc');return {n:bs.length,rows:tops.size,trunc,w:bar.clientWidth,dbg}});
 if(m.rows!==1)bad.push(ids[k]+':rows'+m.rows);
 if(ids[k]==='robot'||ids[k]==='dash')console.log(ids[k],JSON.stringify(m));
 if(m.trunc)bad.push(ids[k]+':省略'+m.trunc)}
console.log('1列でない/省略あり:',bad.join(' ')||'なし');console.log('errs',errs.length);await b.close()})()
