const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.evaluate(()=>openRhythm());await p.waitForTimeout(1500);
const fr=await (await p.$('#rhf')).contentFrame();
await fr.evaluate(()=>{document.querySelectorAll('.dn')[0].click()});await p.waitForTimeout(3200);
await fr.evaluate(()=>{document.getElementById('intro').click()}).catch(()=>{});await p.waitForTimeout(3200);
await fr.evaluate(()=>{var c=document.getElementById('chap');if(c&&c.click)c.click()}).catch(()=>{});await p.waitForTimeout(1500);
console.log(await fr.evaluate(()=>Array.from(document.querySelectorAll('#ready button')).map(b=>b.textContent).join('|')));
await fr.evaluate(()=>{const b=Array.from(document.querySelectorAll('#ready button')).find(b=>/プレイ/.test(b.textContent));if(b)b.click()});
// たたく：全部 F を押し続ける（スコアは低くてもOK）
let t0=Date.now();while(Date.now()-t0<90000){if(await fr.evaluate(()=>document.getElementById('fin').classList.contains('on')))break;await p.keyboard.press('f');await p.keyboard.press('j');await p.waitForTimeout(150)}
await p.waitForTimeout(400);
const act=()=>fr.evaluate(()=>{const a=document.activeElement;return (document.getElementById('fin').contains(a)?'IN:':'OUT:')+a.tagName+'#'+a.id+':'+(a.textContent||'').slice(0,10)});
console.log('fin',await fr.evaluate(()=>document.getElementById('fin').classList.contains('on')),'直後',await act());
const seq=[];for(let i=0;i<6;i++){await p.keyboard.press('Tab');seq.push(await act())}console.log(seq.join(' / '));
await p.screenshot({path:'rhfin.png'});console.log('errors',errs);await b.close()})();
