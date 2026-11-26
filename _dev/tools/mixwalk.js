// ミキサー系レッスン(D-26〜D-34)を実際のマウス操作で進める
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[3]||1366),H=+(process.argv[4]||768),touch=process.argv[5]==='t';
const ids=(process.argv[2]||'D-26,D-27,D-28,D-29,D-30,D-31,D-32,D-33,D-34').split(',');
const cs=(i,s)=>`#mxs .cs[data-i="${i}"] ${s}`;
const F=(i,v)=>['range',cs(i,'.fd'),v],P=(i,v)=>['range',cs(i,'.pn'),v],C=s=>['click',s],R=(k,v)=>['range',`#mxd input[data-k="${k}"]`,v];
const FX=(i,f)=>C(cs(i,`.cf button[data-fx="${f}"]`));
const A={'D-26':{1:[F(3,.85)],2:[F(0,.6)]},'D-27':{1:[P(1,-.6)],2:[P(4,.6)]},
'D-28':{1:[C(cs(2,'.mb b[data-k="solo"]'))],2:[C(cs(2,'.mb b[data-k="solo"]'))],3:[C(cs(0,'.mb b[data-k="mute"]'))],4:[C(cs(0,'.mb b[data-k="mute"]'))]},
'D-29':{1:[FX(1,'eq')],2:[R('lo',-8)],3:[FX(3,'eq')],4:[R('hi',5)]},
'D-30':{1:[F(3,.85),F(0,.6),F(1,.6),F(2,.6),F(4,.6)],2:[P(1,-.5),P(4,.5)],3:[FX(1,'eq'),R('lo',-5)]},
'D-31':{1:[FX(3,'rv')],2:[R('rev',.5)],4:[C('#bypBtn')],5:[C('#bypBtn')]},
'D-32':{1:[FX(3,'dl')],2:[R('dly',.4)],3:[C('#mxd [data-dt=".75"]')]},
'D-33':{1:[FX(0,'cp')],2:[R('comp',.7)]},
'D-34':{1:[FX(0,'cp'),R('comp',.6)],2:[FX(3,'rv'),R('rev',.4),FX(3,'dl'),R('dly',.35)],3:[FX(1,'eq'),R('lo',-5)]}};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const sl=ms=>p.waitForTimeout(ms);const E=c=>p.evaluate(c=>window.__g(c),c);
const hitInfo=(x,y)=>p.evaluate(([x,y])=>{const h=document.elementFromPoint(x,y);return h?(h.closest('#coach')?'COACH':(h.closest('#rpBtn,.rpb,[id*=rep]')?'REPORT':'ok')):'none'},[x,y]);
async function act(a,res,tag){const [k,sel,v]=a;const loc=p.locator(sel).first();
 if(!await loc.count()){res.push(`${tag} missing ${sel}`);return}
 const before=await loc.boundingBox();await loc.scrollIntoViewIfNeeded();const bx=await loc.boundingBox();
 if(!before||before.y<0||before.y+before.height>H||before.x+before.width>W)res.push(`${tag} needed-scroll ${sel}`);
 if(k==='click'){const h=await hitInfo(bx.x+bx.width/2,bx.y+bx.height/2);if(h!=='ok')res.push(`${tag} ${h} over ${sel}`);await p.mouse.click(bx.x+bx.width/2,bx.y+bx.height/2);await sl(300);return}
 const m=await loc.evaluate(e=>({min:+e.min,max:+e.max,v:+e.value,vert:getComputedStyle(e).writingMode.startsWith('vertical')}));
 const f=(v-m.min)/(m.max-m.min),th=16;
 let x,y;if(m.vert){x=bx.x+bx.width/2;y=bx.y+bx.height-th/2-f*(bx.height-th)}else{y=bx.y+bx.height/2;x=bx.x+th/2+f*(bx.width-th)}
 const f0=(m.v-m.min)/(m.max-m.min);let x0,y0;if(m.vert){x0=x;y0=bx.y+bx.height-th/2-f0*(bx.height-th)}else{y0=y;x0=bx.x+th/2+f0*(bx.width-th)}
 const h=await hitInfo(x0,y0);if(h!=='ok')res.push(`${tag} ${h} over thumb ${sel}`);
 await p.mouse.move(x0,y0);await p.mouse.down();for(let s=1;s<=8;s++)await p.mouse.move(x0+(x-x0)*s/8,y0+(y-y0)*s/8);await p.mouse.up();await sl(250);
 const nv=await loc.evaluate(e=>+e.value);if(Math.abs(nv-v)>(m.max-m.min)*.1)res.push(`${tag} range ${sel} wanted ${v} got ${nv}`)}
for(const id of ids){const i=await E(`LES.findIndex(function(l){return l.id==='${id}'})`);await E(`startLesson(${i})`);await sl(300);
 for(let k=0;k<8;k++){const st=await E(`({intro:$('intro').classList.contains('on'),chap:$('chap').className})`);if(st.intro||st.chap.includes('on')){await p.mouse.click(W/2,H/2);await sl(700)}else break}
 await sl(800);let res=[],g=0;
 while(g++<30){const s=await E(`(function(){var s=LES[cur].steps[stp];if(!s)return null;return{stp:stp,ev:s.ev||null,next:!!s.next,tg:s.tg||null,rs:s.rs||null}})()`);if(!s)break;const tag=`${id}#${s.stp}`;
  for(const q of [s.tg,s.rs]){if(!q)continue;const o=await E(`(function(){var e=document.querySelector(${JSON.stringify(q.split(',')[0])});if(!e)return 'missing';var r=e.getBoundingClientRect();if(!r.width)return 'hidden';var h=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return h&&h.closest('#coach')?'COVERED':''})()`);if(o)res.push(`${tag} ${o} ${q}`)}
  await p.screenshot({path:`mx_${id}_${s.stp}.png`});
  if(!s.next){if(s.ev==='played'){await p.click('#play');await sl(2200)}else for(const a of (A[id]&&A[id][s.stp])||[]){await act(a,res,tag)}
   await sl(400);const c=await E('confirming');if(!c){res.push(`${tag} NOT CONFIRMED ev=${s.ev}`);await E('(function(){var s=waiting;waiting=null;if(s)confirmStep(s)})()')}
   await p.screenshot({path:`mx_${id}_${s.stp}ok.png`});await E('if(playing)stopPlay()')}
  try{await p.click('#cnext',{timeout:3000,force:true})}catch(e){res.push(`${tag} cnext click fail`);await E('advance()')}
  await sl(400)}
 res.push(`${id} finish=${await p.evaluate(()=>document.getElementById('fin').classList.contains('on'))}`);console.log(res.join('\n'));
 await p.evaluate(()=>document.getElementById('fin').classList.remove('on'))}
console.log('errors',errs);await b.close()})();
