const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const ids=(process.argv[2]||'D-1,D-2,D-3,D-4,D-5,D-6,D-7').split(',');
const W=+(process.argv[3]||1366),H=+(process.argv[4]||768),touch=process.argv[5]==='t';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const sl=ms=>p.waitForTimeout(ms);const E=c=>p.evaluate(c=>window.__g(c),c);
for(const id of ids){const i=await E(`LES.findIndex(function(l){return l.id==='${id}'})`);
 await E(`startLesson(${i})`);await sl(300);
 for(let k=0;k<8;k++){const st=await E(`({intro:$('intro').classList.contains('on'),chap:$('chap').className})`);if(st.intro||st.chap.includes('on')){await p.mouse.click(W/2,H/2);await sl(700)}else break}
 await sl(800);let guard=0,res=[];
 while(guard++<40){const s=await E(`(function(){var L=LES[cur],s=L.steps[stp];if(!s)return null;return{stp:stp,ev:s.ev||null,next:!!s.next,gs:s.gs||null,tg:s.tg||null,confirming:confirming}})()`);
  if(!s)break;
  await p.screenshot({path:`shot_${id}_${s.stp}.png`});
  // occlusion of targets by coach
  const occ=await E(`(function(){var s=LES[cur].steps[stp];if(!s.tg)return '';const e=document.querySelector(s.tg.split(',')[0]);if(!e||!e.offsetParent)return 'tg-missing';const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const h=document.elementFromPoint(x,y);return h&&h.closest('#coach')?'COVERED':''})()`);
  if(!s.next){const ev=s.ev;let pts=null;
   if(s.gs){pts=await E(`(function(g){var s=LES[cur].steps[stp];if(g==='tapH'){var gr=$('grid').getBoundingClientRect();return{k:'tap',p:[0,2,4,6,8,10,12,14].map(function(c){return[gr.left+gr.width*(c+.5)/16,gr.top+gr.height*2.5/DL.length]})}}return gpts(g,s)})('${s.gs}')`)}
   if(pts&&pts.k==='drag'){await p.mouse.move(...pts.p[0]);await p.mouse.down();for(let f=1;f<=10;f++)await p.mouse.move(pts.p[0][0]+(pts.p[1][0]-pts.p[0][0])*f/10,pts.p[0][1]);await p.mouse.up()}
   else if(pts&&pts.k==='dbl'){await p.mouse.dblclick(...pts.p[0])}
   else if(pts&&pts.k==='tap'){for(const q of pts.p){const hit=await p.evaluate(q=>{const h=document.elementFromPoint(q[0],q[1]);return h?(h.id||h.className):''},q);if(!/grid|nt|cell|row|bg/.test(String(hit)))res.push(`${id}#${s.stp} tap hit:${hit}`);await p.mouse.click(...q);await sl(120)}}
   else if(ev==='tempo'){const goal=await E(`LES[cur].steps[stp].need(140)?'#bp':'#bm'`);const bx=await p.locator(goal).boundingBox();await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.mouse.down();await sl(4500);await p.mouse.up()}
   else if(ev==='keyPress'){const ks=await p.evaluate(()=>{const r=document.getElementById('keys').getBoundingClientRect(),e=document.getElementById('escroll').getBoundingClientRect();return [0.9,0.7,0.5,0.3,0.15].map(f=>[r.left+r.width*0.3,e.top+e.height*f])});for(const q of ks){await p.mouse.click(...q);await sl(150)}}
   else if(ev==='played'){await p.click('#play');await sl(2500)}
   else if(s.tg){const sel=s.tg.split(',')[0];try{await p.click(sel,{timeout:3000})}catch(e){res.push(`${id}#${s.stp} click fail ${sel}: ${e.message.split('\n')[0]}`)}}
   await sl(500);
   const c=await E('confirming');if(!c){res.push(`${id}#${s.stp} NOT CONFIRMED ev=${ev}`);await E('(function(){var s=waiting;waiting=null;if(s)confirmStep(s)})()')}
   await p.screenshot({path:`shot_${id}_${s.stp}ok.png`});
   await E('if(playing)stopPlay()');
  }
  if(occ)res.push(`${id}#${s.stp} ${occ}`);
  try{await p.click('#cnext',{timeout:3000,force:true})}catch(e){res.push(`${id}#${s.stp} cnext click fail`);await E('advance()')}
  await sl(400)}
 const fin=await p.evaluate(()=>document.getElementById('fin').classList.contains('on'));res.push(`${id} finish=${fin}`);console.log(res.join('\n'));
 await p.evaluate(()=>{document.getElementById('fin').classList.remove('on')});
}
console.log('errors',errs);await b.close()})();
