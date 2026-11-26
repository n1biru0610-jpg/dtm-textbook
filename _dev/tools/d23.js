const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));const E=c=>p.evaluate(c=>window.__g(c),c);
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
await E(`startLesson(LES.findIndex(function(l){return l.id==='D-23'}))`);await p.waitForTimeout(300);
for(let k=0;k<5;k++){const st=await E(`({intro:$('intro').classList.contains('on'),chap:$('chap').className})`);if(st.intro||st.chap.includes('on')){await p.mouse.click(W/2,H/2);await p.waitForTimeout(700)}else break}
await p.waitForTimeout(800);
await p.click('#toolEr');await p.waitForTimeout(400);console.log('st0',await E('confirming'));await p.click('#cnext',{force:true});await p.waitForTimeout(900);
for(const s of [0,12]){await p.screenshot({path:`d23_${s}.png`});
 for(const i of [2,3]){const sel=`.lane[data-i="${i}"] .clip[data-s="${s}"]`;const v=await p.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return 'none';const r=e.getBoundingClientRect();const x=r.left+Math.min(20,r.width/2),y=r.top+r.height/2;const h=document.elementFromPoint(x,y);return {x,y,ok:!!(h&&h.closest(sel)),hit:h&&(h.id||h.className)}},sel);console.log(s,i,JSON.stringify(v));
  if(v.ok)await p.mouse.click(v.x,v.y);else{console.log('NOT VISIBLE -> playwright click');await p.click(sel,{force:false}).catch(e=>console.log('fail'))}await p.waitForTimeout(400)}
 console.log('confirmed',await E('confirming'));await p.click('#cnext',{force:true});await p.waitForTimeout(900)}
console.log('errors',errs);await b.close()})();
