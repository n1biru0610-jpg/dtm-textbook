const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file:///tmp/w/dawt3.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
console.log(await E("CHS.map(function(c){return c.n+c.t}).join(' / ')"));
const ids=(process.argv[2]||'57,58,59,60,61,62,63,64,65,66,67,68,69').split(',');
for(const k of ids){
 const i=await E(`LES.map(function(l){return l.id}).indexOf('D-${k}')`);if(i<0){console.log('D-'+k,'MISSING');continue}
 await E(`startLesson(${i})`);await p.waitForTimeout(3500);
 for(let q=0;q<5;q++){const on=await E("document.getElementById('chap').className");if(/on/.test(on)){await p.mouse.click(683,384);await p.waitForTimeout(400)}}
 const n=await E("LES[cur].steps.length");const log=[];
 for(let st=0;st<n;st++){
  await p.waitForTimeout(900);const info=await E("({stp:stp,ev:LES[cur].steps[stp].ev,nx:!!LES[cur].steps[stp].next,t:LES[cur].steps[stp].need?1:0})");
  if(info.stp!==st){log.push('STUCK@'+st+'(at '+info.stp+')');break}
  if(info.nx){await E("$('cnext').click()")}
  else{
   const ev=info.ev;
   // 各レッスン固有の操作
   const act=await E(`(function(){var id=LES[cur].id,ev=LES[cur].steps[stp].ev,x=stp;
    if(ev==='played'){fire('played');return 'played'}
    if(ev==='noteSel'){nsel=[openClip.notes[0]];fire('noteSel',1);return 'sel'}
    if(ev==='velSet'){if(x===2){nsel=[openClip.notes[0]];vSet(.4)}else{[1,2,3].forEach(function(i){nsel=[openClip.notes[i]];vSet(.4)})}return 'vel'}
    if(ev==='quant'){selClip=openClip;quantizeClip(selClip);return 'q'}
    if(ev==='saved'){saveProject();return 'saved'}
    if(ev==='midiOut'){$('midiBtn').click();return 'midi'}
    if(ev==='blk'){$('blkBtn').click();return 'blk'}
    if(ev==='mute'){var i=+LES[cur].steps[stp].tg.match(/data-i=.(\\d)/)[1],t=document.querySelector(LES[cur].steps[stp].tg);t.click();return 'mute'+i}
    if(ev==='notes'){var s=LES[cur].steps[stp];
      if(s.dk){eval('('+s.dk+')'||0)}
      var pts=s.pts,ps=typeof pts==='function'?pts():pts;
      if(id==='D-58'){openClip.notes.forEach(function(n,i){if(i<5)n.l=4})}
      else if(id==='D-65'){[29,30,31].forEach(function(q){openClip.notes.push({s:q,p:1,l:1})})}
      else if(id==='D-66'||id==='D-67'){if(openClip)[0,4,8,12].forEach(function(q){openClip.notes.push({s:q,p:60,l:4})})}
      else if(ps){ps.forEach(function(a){openClip.notes.push({s:a[0],p:a[1],l:4})})}
      fire('notes',1);return 'notes'}
    return 'none:'+ev})()`);
   await p.waitForTimeout(900);
   const adv=await E("(function(){var b=document.getElementById('cnext');return b&&b.offsetParent!==null})()");
   if(adv)await E("$('cnext').click()");
   log.push(act);
  }
  await p.waitForTimeout(500);
 }
 const done=await E(`!!done['D-${k}']`);
 console.log('D-'+k,done?'OK':'NG',log.join(','));
}
console.log('errs',errs);await b.close()})()
