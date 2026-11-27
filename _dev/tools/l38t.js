const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h,t] of [[1366,768,0],[844,390,1]]){
const c=await b.newContext({viewport:{width:w,height:h},hasTouch:!!t,isMobile:!!t});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/w/l38.html');await p.waitForTimeout(400);
const nx=()=>p.$eval('#next',e=>e.disabled);
console.log(w,'start disabled',await nx(),await p.$eval('#line',e=>e.textContent).then(s=>s.slice(0,20)));
await p.evaluate(()=>{[0,1,2,3].forEach((c,i)=>__mel.click(i+1,c))});
await p.evaluate(()=>document.querySelector('[data-k=play]').click());await p.waitForTimeout(3200);
console.log('step0 done',!(await nx()));
await p.evaluate(()=>document.getElementById('next').click());
await p.evaluate(()=>document.querySelector('[data-k=sj]').click());await p.waitForTimeout(3200);console.log('jp',!(await nx()),await p.$eval('#homeNote',e=>e.textContent),await p.$$eval('.mlab',a=>a.map(x=>x.textContent).join('')));
await p.evaluate(()=>document.getElementById('next').click());await p.evaluate(()=>document.querySelector('[data-k=so]').click());await p.waitForTimeout(3200);console.log('ok',!(await nx()),await p.$$eval('.mlab',a=>a.map(x=>x.textContent).join('')));
await p.evaluate(()=>document.getElementById('next').click());await p.evaluate(()=>document.querySelector('[data-k=sb]').click());await p.waitForTimeout(3200);console.log('bl',!(await nx()),await p.$$eval('.mlab',a=>a.map(x=>x.textContent).join('')));
await p.evaluate(()=>document.getElementById('next').click());for(const k of ['sm','sw','ss','sd']){await p.evaluate(k=>document.querySelector('[data-k='+k+']').click(),k);await p.waitForTimeout(3200)}console.log('more',!(await nx()));await p.evaluate(()=>document.getElementById('next').click());await p.waitForTimeout(300);console.log('last',await p.$eval('#go',e=>getComputedStyle(e).display),await p.$$eval('#mbtns button',a=>a.map(x=>x.textContent).join('|')));
await p.screenshot({path:`l38_${w}.png`});
await p.evaluate(()=>document.getElementById('again').click());await p.waitForTimeout(200);console.log('again',await p.$eval('#line',e=>e.textContent.slice(0,12)),await p.$$eval('.mlab',a=>a.map(x=>x.textContent).join('')));
console.log('errs',errs);await c.close()}
await b.close()})()
