const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const errs=[];
for(const [id,w,h,t] of [['D-57',1366,768,0],['D-66',1366,768,0],['D-67',844,390,1],['D-57',844,390,1]]){
const c=await b.newContext({viewport:{width:w,height:h},hasTouch:!!t,isMobile:!!t});const p=await c.newPage();p.on('pageerror',e=>errs.push(id+':'+e.message));await p.route(/google/,r=>r.abort());
await p.goto('file:///tmp/w/dawt3.html');await p.waitForTimeout(1500);
const E=x=>p.evaluate(x=>window.__g(x),x);
const i=await E(`LES.map(function(l){return l.id}).indexOf('${id}')`);await E(`startLesson(${i})`);await p.waitForTimeout(3500);
for(let q=0;q<5;q++){const on=await E("document.getElementById('chap').className");if(/on/.test(on)){await p.mouse.click(w/2,h/2);await p.waitForTimeout(400)}}
if(id==='D-57'){await E("(function(){nsel=[openClip.notes[1],openClip.notes[3],openClip.notes[5]];vSet(.4);nsel=[openClip.notes[2]];vSet(.7);$('play').click()})()");await p.waitForTimeout(2500);console.log(id,w,'midi bytes',(await E("midiB64().length")),'weak',await E("openClip.notes.filter(function(n){return n.v<.99}).length"))}
else{await p.waitForTimeout(1500);await E("$('play').click()");await p.waitForTimeout(2500);console.log(id,'AB',await E("Object.keys(AB).length"),'clips',await E("T[0].clips.length"))}
await p.screenshot({path:`exshot_${id}_${w}.png`});await c.close()}
console.log('errs',errs);await b.close()})()
