// ほうこくボタンの下に隠れている操作部品がないか（各モード・各画面サイズ）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const sizes=[[667,375],[844,390],[932,430],[1024,768],[1280,800],[1366,768]];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const [W,H] of sizes){const touch=W<1000;
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2000);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(600);
const modes={home:async()=>{},lesson:async()=>{await p.evaluate(()=>startLesson(L.findIndex(x=>x.id==='2-6')));await p.waitForTimeout(4500);await p.mouse.click(W/2,H/2);await p.waitForTimeout(1200)},
 dawmap:async()=>{await p.evaluate(()=>openDaw());await p.waitForTimeout(2500)},
 rhythm:async()=>{await p.evaluate(()=>openRhythm());await p.waitForTimeout(2000)},
 shortcut:async()=>{await p.evaluate(()=>openShortcut());await p.waitForTimeout(2000)},
 glossary:async()=>{await p.evaluate(()=>openGlossary());await p.waitForTimeout(2000)},
 other:async()=>{await p.evaluate(()=>openOther());await p.waitForTimeout(1500)},
 studio:async()=>{await p.evaluate(()=>openStudio());await p.waitForTimeout(3000)}};
for(const [m,fn] of Object.entries(modes)){try{await fn()}catch(e){console.log(W,m,'open fail',e.message.slice(0,80));continue}
 const r=await p.evaluate(()=>{const e=document.getElementById('rpBtn');if(!e)return null;const b=e.getBoundingClientRect();if(!b.width||getComputedStyle(e).display==='none')return null;e.style.visibility='hidden';return{x:b.left,y:b.top,w:b.width,h:b.height}});
 if(!r){console.log(W,m,'rpBtn not visible');continue}
 const hits=new Set();
 for(const fx of [.1,.5,.9])for(const fy of [.2,.5,.8]){const X=r.x+r.w*fx,Y=r.y+r.h*fy;
  const top=await p.evaluate(([X,Y])=>{const h=document.elementFromPoint(X,Y);if(!h)return null;if(h.tagName==='IFRAME'){const b=h.getBoundingClientRect();h.setAttribute('data-ov','1');return{ifr:h.id,x:X-b.left,y:Y-b.top}}const i=h.closest('button,a,input,select,textarea,[role=button],[onclick]');return i?{hit:(i.id||i.className||i.tagName)+':'+(i.textContent||'').trim().slice(0,12)}:null},[X,Y]);
  if(!top)continue;if(top.hit){hits.add('親:'+top.hit);continue}
  const fr=await (await p.$('#'+top.ifr)).contentFrame();
  const inn=await fr.evaluate(([x,y])=>{const h=document.elementFromPoint(x,y);if(!h)return null;const i=h.closest('button,a,input,select,textarea,[role=button],[onclick],.cell,.clip');return i?(i.id||i.className||i.tagName)+':'+(i.textContent||'').trim().slice(0,12):null},[top.x,top.y]);
  if(inn)hits.add(top.ifr+':'+inn)}
 await p.evaluate(()=>{document.getElementById('rpBtn').style.visibility=''});
 if(hits.size)console.log(W,H,m,'ほうこくの下:',[...hits].join(' / '));
 await p.screenshot({path:`ov_${m}_${W}.png`});
}
if(errs.length)console.log(W,'errors',errs);await p.close()}
console.log('done');await b.close()})();
