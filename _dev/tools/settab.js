const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.click('#setBtn');await p.waitForTimeout(600);
const seq=[];for(let i=0;i<25;i++){await p.keyboard.press(i<12?'Tab':'Shift+Tab');seq.push(await p.evaluate(()=>{const a=document.activeElement;return (document.getElementById('setM').contains(a)?'IN:':'OUT:')+(a.id||a.tagName)+':'+(a.textContent||'').slice(0,8)}))}
console.log(seq.join('\n'));console.log('errors',errs);await b.close()})();
