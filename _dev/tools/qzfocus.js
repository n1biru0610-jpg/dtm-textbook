const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.evaluate(()=>{quizStart(Object.keys(QZ)[0],function(){window.__done=1})});await p.waitForTimeout(400);
const act=()=>p.evaluate(()=>{const a=document.activeElement;return a.className+':'+(a.textContent||'').slice(0,14)});
console.log('初期フォーカス',await act());
await p.keyboard.press('Enter');await p.waitForTimeout(200);
console.log('Enter後 押された答え',await p.evaluate(()=>document.querySelectorAll('#qc .qo .ok,#qc .qo .ng').length));
await p.keyboard.press('Tab');console.log('Tab1',await act());
// 正解を押して次へ
await p.evaluate(()=>{const q=qzQ[qzI];[...document.querySelectorAll('#qc .qo button')].find(x=>x.textContent===q[1][q[2]]).click()});await p.waitForTimeout(200);
console.log('正解後',await act());await p.keyboard.press('Enter');await p.waitForTimeout(300);
console.log('次の問題',await act(),await p.evaluate(()=>qzI));
console.log('errors',errs);await b.close()})();
