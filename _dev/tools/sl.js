const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:+(process.argv[2]||1366),height:+(process.argv[3]||768)}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file:///tmp/w/dawt3.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
const ids=await E("LES.map(function(l){return l.id+':'+l.ch})");console.log('chapters',await E("CHS.map(function(c){return c.n+c.t}).join(' / ')"));
const idx=await E("LES.map(function(l,i){return l.id}).filter(function(x){return /D-4[1-9]|D-5/.test(x)}).length");console.log('scale lessons',idx);
let bad=0;
const K0=+(process.argv[4]||41),K1=+(process.argv[5]||56);for(let k=K0;k<=K1;k++){
 const i=await E(`LES.map(function(l){return l.id}).indexOf('D-${k}')`);await E(`startLesson(${i})`);await p.waitForTimeout(900);
 // chapter intro may block
 for(let q=0;q<5;q++){const on=await E("document.getElementById('chap').className");if(/on/.test(on)){await p.mouse.click(683,384);await p.waitForTimeout(400)}}
 const log=[];let ok=true;
 for(let st=0;st<7;st++){
  const info=await E("({stp:stp,n:LES[cur].steps.length,ev:LES[cur].steps[stp]&&LES[cur].steps[stp].ev,fin:!LES[cur].steps[stp]})");
  if(info.fin||st>=info.n)break;
  const s=info.stp;
  if(s===0||s===6){await E("$('cnext').click()")}
  else if(s===1){for(let q=0;q<6;q++)await E("document.querySelector('.pk').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))")}
  else if(s===2){await E("(function(){var P=[];for(var p=60;p<=72;p++)if(inG(p))P.push(p);[0,4,8,12,16,20].forEach(function(st,j){openClip.notes.push({s:st,p:P[(j*2)%P.length],l:4})});fire('notes',1)})()")}
  else if(s===3||s===5){await E("fire('played')")}
  else if(s===4){await E("(function(){openClip.notes.push({s:28,p:60,l:4});fire('notes',1)})()")}
  await p.waitForTimeout(700);
  // 確認待ち(confirm)をすすめる
  const adv=await E("(function(){var b=document.getElementById('cnext');return b&&b.offsetParent!==null})()");
  if(adv&&s!==0&&s!==6){await E("$('cnext').click()")}
  const after=await E("({stp:stp,fin:!LES[cur].steps[stp]})");log.push(s+'→'+after.stp);
 }
 const done=await E(`!!done['D-${k}']`);if(!done){bad++}
 console.log('D-'+k,done?'OK':'NG',log.join(' '));
}
console.log('bad',bad,'errs',errs);await b.close()})()
