const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:+(process.argv[2]||1366),height:+(process.argv[3]||768)}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
await E(`startLesson(0)`);await p.waitForTimeout(9000);
const act=()=>p.evaluate(()=>{const a=document.activeElement;return (document.getElementById('ctxm').contains(a)?'IN:':'OUT:')+a.tagName+'['+(a.getAttribute('role')||'')+'] '+(a.textContent||'').slice(0,20)+' exp='+a.getAttribute('aria-expanded')});
const on=()=>E("$('ctxm').classList.contains('on')");
const play=()=>E('playing');
// Tab の順に、メニュー（span.mm）にたどり着けるか
let found=false;for(let i=0;i<80;i++){await p.keyboard.press('Tab');const a=await p.evaluate(()=>document.activeElement.className);if(/\bmm\b/.test(a)){found=true;break}}
console.log('Tabでメニューに到達',found,await act());
const n0=await p.evaluate(()=>[...document.querySelectorAll('#menu span.mm')].filter(x=>x.offsetParent).map(x=>x.textContent));console.log('見えるメニュー',n0.join(','));
await p.evaluate(()=>[...document.querySelectorAll('#menu span.mm')].find(x=>x.textContent==='トランスポート').focus());
await p.keyboard.press('Enter');await p.waitForTimeout(200);console.log('Enter',await on(),await act());
await p.screenshot({path:'menu1.png'});
await p.keyboard.press('ArrowDown');console.log('Down',await act());
await p.keyboard.press('ArrowUp');await p.keyboard.press('ArrowUp');console.log('Up x2(wrap)',await act());
await p.keyboard.press('Home');console.log('Home',await act());
await p.keyboard.press('ArrowRight');await p.waitForTimeout(100);console.log('Right',await on(),await act());
await p.keyboard.press('Escape');await p.waitForTimeout(100);console.log('Esc',await on(),await act());
// Space で開く→ 再生が始まらないこと
await p.evaluate(()=>[...document.querySelectorAll('#menu span.mm')].find(x=>x.textContent==='トランスポート').focus());
await p.keyboard.press(' ');await p.waitForTimeout(100);console.log('Space on span → play',await on(),'playing',await play());await E('stopPlay()');await p.keyboard.press('Enter');
await p.keyboard.press(' ');await p.waitForTimeout(300);console.log('Space on 再生／停止 item',await on(),'playing',await play(),await act());
await E('stopPlay()');
await p.evaluate(()=>[...document.querySelectorAll('#menu span.mm')].find(x=>x.textContent==='ヘルプ').focus());
await p.keyboard.press('Enter');await p.keyboard.press('Enter');await p.waitForTimeout(300);console.log('ヘルプ→ショートカット一覧',await E("$('kbhelp').classList.contains('on')"));
await p.keyboard.press('Escape');await p.waitForTimeout(200);
await p.evaluate(()=>[...document.querySelectorAll('#menu span.mm')].find(x=>x.textContent==='編集').focus());
await p.keyboard.press('Enter');await p.keyboard.press('Tab');await p.waitForTimeout(100);console.log('Tab closes',await on(),await act());
// マウスで開いて、矢印で入れる
await p.evaluate(()=>document.activeElement.blur());
const r=await p.evaluate(()=>{const s=[...document.querySelectorAll('#menu span.mm')].find(x=>x.textContent==='表示').getBoundingClientRect();return [s.x+s.width/2,s.y+s.height/2]});
await p.mouse.click(r[0],r[1]);await p.waitForTimeout(200);console.log('mouse open',await on(),await act());
await p.keyboard.press('ArrowDown');console.log('mouse→Down',await act());await p.keyboard.press('Escape');console.log('Esc',await on(),await act());
await p.mouse.click(r[0],r[1]);await p.waitForTimeout(200);await p.screenshot({path:'menu2.png'});await p.mouse.click(600,400);console.log('outside click',await on());
console.log('errors',errs);await b.close()})();
