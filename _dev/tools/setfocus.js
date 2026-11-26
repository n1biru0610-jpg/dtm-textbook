const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const act=()=>p.evaluate(()=>{const a=document.activeElement;return a.tagName+'#'+a.id+':'+(a.textContent||'').slice(0,10)});
await p.focus('#setBtn');await p.keyboard.press('Enter');await p.waitForTimeout(400);console.log('設定 開いた直後',await act());
await p.keyboard.press('Enter');await p.waitForTimeout(200);console.log('Enterで何も起きない? open=',await p.evaluate(()=>document.getElementById('setM').classList.contains('on')));
await p.keyboard.press('Tab');console.log('Tab1',await act());
await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('Esc後',await act(),'open=',await p.evaluate(()=>document.getElementById('setM').classList.contains('on')));
await p.click('#setBtn');await p.waitForTimeout(300);await p.click('#setX');await p.waitForTimeout(200);console.log('とじる後',await act());
// スタッフ設定（擬似的に開く）
await p.evaluate(()=>{document.getElementById('stfM').classList.add('on')});await p.keyboard.press('Escape');await p.waitForTimeout(200);console.log('stf Esc後 open=',await p.evaluate(()=>document.getElementById('stfM').classList.contains('on')));
await p.screenshot({path:'setfocus.png'});
console.log('errors',errs);await b.close()})();
