// 「動きをへらす」設定（prefers-reduced-motion）のとき、DAW編の「つぎへ」のぴょこぴょこ・ハイライトの点滅が止まるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const rm of ['no-preference','reduce']){
const p=await b.newPage({viewport:{width:1366,height:768},reducedMotion:rm});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);const E=c=>p.evaluate(c=>window.__g(c),c);
await E('startLesson(0)');await p.waitForTimeout(9000);
console.log(rm,await p.evaluate(()=>['cnext','ring'].map(i=>{const e=document.getElementById(i);if(i==='ring'){e.classList.add('on')}const c=getComputedStyle(e);return i+':'+c.animationName+' shadow='+(c.boxShadow!=='none')+' vis='+(c.display!=='none')})));
await p.screenshot({path:'dawrm_'+rm+'.png'});console.log('errors',errs);await p.close()}
await b.close()})();
