// 基礎編の汎用ウォーカー：各ステップで押せる部品を実クリックし、「つぎへ」が有効になるか／親画面の部品に隠れていないかを見る
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[3]||1366),H=+(process.argv[4]||768),touch=process.argv[5]==='t';
const only=process.argv[2]&&process.argv[2]!=='all'?process.argv[2].split(','):null;
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push('top:'+e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);
await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const ids=await p.evaluate(()=>L.map(l=>l.id));
const sl=ms=>p.waitForTimeout(ms);
for(let i=0;i<ids.length;i++){const id=ids[i];if(only&&!only.includes(id))continue;const res=[];
 await p.evaluate(i=>{startLesson(i)},i);await sl(1200);
 for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(W/2,H/2);await sl(800)}else break}
 await sl(1500);
 const fe=await p.$('#f');const fr=await fe.contentFrame();fr.page().on('pageerror',()=>{});
 await fr.evaluate(()=>{window.addEventListener('error',e=>{window.__errs=(window.__errs||[]).concat(e.message)})});
 let guard=0,last=-1;
 while(guard++<30){
  const st=await fr.evaluate(()=>{const n=document.getElementById('next'),g=document.getElementById('go');return{line:(document.getElementById('line')||{}).textContent||'',dis:n?n.disabled:null,nvis:n?n.style.display!=='none':false,gvis:g?g.style.display!=='none':false}});
  if(!st.nvis){res.push(`${id} 最後のステップ到達 go=${st.gvis}`);break}
  const stepNo=guard;
  if(st.dis){
   let ok=false;
   for(let pass=0;pass<2&&!ok;pass++){
    const cands=await fr.evaluate(()=>{const out=[];document.querySelectorAll('button,[role=button],[onclick],.cell,.key,.pad').forEach((e,ix)=>{if(['next','again','go'].includes(e.id))return;if(e.closest('#go'))return;if(!e.offsetParent||e.disabled)return;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<0.2)return;e.dataset.kw=ix;out.push(ix)});return out});
    for(const ix of cands){
     const info=await fr.evaluate(ix=>{const e=document.querySelector('[data-kw="'+ix+'"]');if(!e)return null;e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const h=document.elementFromPoint(x,y);return{x,y,w:r.width,hh:r.height,self:!!h&&(h===e||e.contains(h)||h.contains(e)),hit:h?(h.id||h.className||h.tagName):'',name:(e.id||e.className||e.tagName)+':'+(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,12)}},ix);
     if(!info)continue;
     const off=await fe.boundingBox();const X=off.x+info.x,Y=off.y+info.y;
     const top=await p.evaluate(([X,Y])=>{const h=document.elementFromPoint(X,Y);return h?(h.id==='f'?'':(h.id||h.className||h.tagName)):'none'},[X,Y]);
     if(top&&pass===0)res.push(`${id}#${stepNo} 親の部品に隠れる: ${info.name} ← ${top}`);
     if(!info.self&&pass===0)res.push(`${id}#${stepNo} レッスン内で隠れる: ${info.name} ← ${info.hit}`);
     if(info.w<24||info.hh<24){ if(pass===0)res.push(`${id}#${stepNo} 小さい(${Math.round(info.w)}x${Math.round(info.hh)}): ${info.name}`)}
     if(touch)await p.touchscreen.tap(X,Y);else await p.mouse.click(X,Y);
     await sl(350);
     if(!(await fr.evaluate(()=>document.getElementById('next').disabled))){ok=true;break}
    }
    if(!ok){for(let w=0;w<11&&!ok;w++){await sl(1000);ok=!(await fr.evaluate(()=>document.getElementById("next").disabled))}}
    if(false){ok=!(await fr.evaluate(()=>document.getElementById('next').disabled))}
   }
   if(!ok){res.push(`${id}#${stepNo} 汎用クリックでは進めず: ${st.line.slice(0,50)}`);await fr.evaluate(()=>{document.getElementById('next').disabled=false})}
  }
  await p.screenshot({path:`k_${id}_${stepNo}.png`});
  // つぎへ自体が隠れていないか
  const nb=await (await fr.$('#next')).boundingBox();const tn=await p.evaluate(([X,Y])=>{const h=document.elementFromPoint(X,Y);return h?(h.id==='f'?'':(h.id||h.className)):'none'},[nb.x+nb.width/2,nb.y+nb.height/2]);
  if(tn)res.push(`${id}#${stepNo} 「つぎへ」が親の部品に隠れる ← ${tn}`);
  await fr.evaluate(()=>document.getElementById('next').click());await sl(500);
 }
 const fe2=await fr.evaluate(()=>window.__errs||[]);if(fe2.length)res.push(`${id} lesson errors: ${fe2.join(';')}`);
 console.log(res.join('\n'));
}
console.log('errors',errs);await b.close()})();
