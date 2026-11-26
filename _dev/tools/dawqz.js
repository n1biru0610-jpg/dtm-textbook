const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);const E=c=>p.evaluate(c=>window.__g(c),c);
await E('startLesson(0)');await p.waitForTimeout(9000);
const A=()=>p.evaluate(()=>{const a=document.activeElement;return a.tagName+'#'+a.id+':'+(a.textContent||'').trim().slice(0,14)});
let ok=false;for(let t=0;t<70;t++){await p.keyboard.press('Tab');if((await A()).includes('#qzQ')){ok=true;break}}console.log('Tab→qzQ',ok);
await p.keyboard.press('Enter');await p.waitForTimeout(200);console.log('open',await E("$('ctxm').classList.contains('on')"),await A());
await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');await p.waitForTimeout(200);console.log('chose',await E("$('qzQ').textContent"),'focus',await A());
await p.keyboard.press('Tab');console.log('next Tab',await A());
await p.keyboard.press('Enter');await p.keyboard.press('Escape');console.log('esc',await E("$('ctxm').classList.contains('on')"),await A());
await p.screenshot({path:'qz.png'});
// マウス
await p.evaluate(()=>document.activeElement.blur());await p.click('#qzS');await p.waitForTimeout(200);console.log('mouse open',await E("$('ctxm').classList.contains('on')"),await A());await p.mouse.click(700,400);
console.log('errors',errs);await b.close()})();
