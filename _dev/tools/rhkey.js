// リズム編：マップのステージ（.dn）がキーボードで選べるか、名前のない部品、ステージ中の Tab 順
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
await p.evaluate(()=>openRhythm());await p.waitForTimeout(1500);
const fr=await (await p.$('#rhf')).contentFrame();
const audit=()=>fr.evaluate(()=>{const nf=[],nn=[];[...document.querySelectorAll('*')].forEach(e=>{if(!e.offsetParent)return;const cs=getComputedStyle(e);const clickable=cs.cursor==='pointer'||e.onclick;if(clickable&&e.tabIndex<0&&!e.closest('button,a,[tabindex]'))nf.push(e.tagName+'#'+e.id+'.'+String(e.className).slice(0,20)+':'+e.textContent.trim().slice(0,10));
 if((e.tagName==='BUTTON'||e.getAttribute('role')==='button')&&!(e.getAttribute('aria-label')||e.textContent.trim()))nn.push(e.id+'.'+e.className)});return {notFocusable:[...new Set(nf)].slice(0,10),nf:nf.length,noName:nn}});
console.log('map',JSON.stringify(await audit()));
const A=()=>p.evaluate(()=>{let a=document.activeElement;let pre='';if(a&&a.tagName==='IFRAME'){a=a.contentDocument.activeElement;pre='[r]'}return pre+a.tagName+'#'+a.id+'.'+String(a.className).slice(0,10)+':'+(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,12)});
const seq=[];for(let t=0;t<14;t++){await p.keyboard.press('Tab');seq.push(await A())}console.log('map Tab:',seq.join(' | '));
// 1つ目のステージを Enter
for(let t=0;t<30;t++){const a=await A();if(/\.dn/.test(a)||/^\[r\].*dn/.test(a))break;await p.keyboard.press('Tab')}
console.log('on stage?',await A());await p.keyboard.press('Enter');await p.waitForTimeout(3500);
console.log('after Enter intro/chap on:',await fr.evaluate(()=>['intro','chap','ready','game'].map(i=>{const e=document.getElementById(i);return i+'='+(e?e.classList.contains('on'):'-')}).join(',')));
await p.waitForTimeout(4000);
console.log('stage',JSON.stringify(await audit()));
const s2=[];for(let t=0;t<12;t++){await p.keyboard.press('Tab');s2.push(await A())}console.log('stage Tab:',s2.join(' | '));
console.log('errors',errs);await b.close()})();
