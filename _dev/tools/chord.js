const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));const E=c=>p.evaluate(c=>window.__g(c),c);
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
for(const [id,st,seq] of [['D-17',1,[['C',0]]],['D-17',2,[['G',1],['Am',2],['F',3]]],['D-18',1,[['C',0],['G',1],['Am',2],['C',3]]]]){
 if(!(await E(`LES[cur].id`)==id&&st>0&&await E('stp')==st-1)){await E(`startLesson(LES.findIndex(function(l){return l.id==='${id}'}))`);await p.waitForTimeout(7000);await E(`stp=${st};showStep()`);await p.waitForTimeout(800)}
 else {await E('advance()');await p.waitForTimeout(800)}
 await p.waitForTimeout(400);await p.screenshot({path:`pre_${id}_${st}.png`});console.log(id,st,'cbarCovered=',await E("(function(){var r=$('cbar').getBoundingClientRect(),h=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !!(h&&h.closest('#coach'))})()"));
 for(const [ch,bar] of seq){await p.locator('#cbar button',{hasText:new RegExp('^'+ch+'$')}).click();await p.waitForTimeout(200);
  const pt=await E(`(function(){var P=gpts('pts',LES[cur].steps[stp]);return P.p[P.p.length===1?0:(LES[cur].id==='D-18'?${bar}:${bar}-1)]})()`);
  const hit=await p.evaluate(q=>{const h=document.elementFromPoint(q[0],q[1]);return h&&h.closest('#coach')?'COVERED':''},pt);
  await p.mouse.click(pt[0],pt[1]);await p.waitForTimeout(250);if(hit)console.log(id,st,ch,'covered')}
 console.log(id,st,'confirmed=',await E('confirming'));await p.screenshot({path:`ch_${id}_${st}.png`})}
console.log('errors',errs);await b.close()})();
