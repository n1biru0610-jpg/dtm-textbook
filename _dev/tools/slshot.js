const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [w,h,t] of [[1366,768,0],[844,390,1]]){
const c=await b.newContext({viewport:{width:w,height:h},hasTouch:!!t,isMobile:!!t});const p=await c.newPage();await p.route(/google/,r=>r.abort());
await p.goto('file:///tmp/w/dawt3.html');await p.waitForTimeout(1500);
const E=x=>p.evaluate(x=>window.__g(x),x);
const i=await E("LES.map(function(l){return l.id}).indexOf('D-43')");await E(`startLesson(${i})`);await p.waitForTimeout(1500);
for(let q=0;q<5;q++){const on=await E("document.getElementById('chap').className");if(/on/.test(on)){await p.mouse.click(w/2,h/2);await p.waitForTimeout(500)}}
await E("$('cnext').click()");await p.waitForTimeout(500);await E("$('cnext').click&&0");
for(let q=0;q<6;q++)await E("document.querySelector('.pk').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))");await p.waitForTimeout(1200);
const adv=await E("(function(){var b=document.getElementById('cnext');return b&&b.offsetParent!==null})()");if(adv)await E("$('cnext').click()");await p.waitForTimeout(800);
await p.screenshot({path:`slshot_${w}.png`});console.log(w,await E("$('ctx').textContent.slice(0,40)"));await c.close()}
await b.close()})()
