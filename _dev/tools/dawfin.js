const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
await E(`startLesson(0)`);await p.waitForTimeout(500);for(let k=0;k<4;k++){await p.mouse.click(683,384);await p.waitForTimeout(600)}
await E('finish()');await p.waitForTimeout(500);
const act=()=>p.evaluate(()=>{const a=document.activeElement;return (document.getElementById('fin').contains(a)?'IN:':'OUT:')+a.tagName+'#'+a.id+':'+(a.textContent||'').slice(0,10)});
console.log('直後',await act());const seq=[];for(let i=0;i<10;i++){await p.keyboard.press('Tab');seq.push(await act())}console.log(seq.join(' / '));
await p.screenshot({path:'dawfin.png'});console.log('errors',errs);await b.close()})();
