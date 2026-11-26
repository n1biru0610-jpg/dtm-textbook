// 基礎編：決まった置き方が必要なステップを、ヒントどおりの実クリック → だめなら実クリックの探索で進められるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[3]||1366),H=+(process.argv[4]||768),touch=process.argv[5]==='t';
const only=process.argv[2].split(',');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push('top:'+e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);
await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const ids=await p.evaluate(()=>L.map(l=>l.id));const sl=ms=>p.waitForTimeout(ms);
for(let i=0;i<ids.length;i++){const id=ids[i];if(!only.includes(id))continue;const res=[];
 await p.evaluate(i=>{startLesson(i)},i);await sl(1200);
 for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(W/2,H/2);await sl(800)}else break}
 await sl(1500);const fe=await p.$('#f');const fr=await fe.contentFrame();
 await fr.evaluate(()=>{window.__errs=[];window.addEventListener('error',e=>{window.__errs.push(e.message)})});
 const off=await fe.boundingBox();
 const tap=async(x,y)=>{if(touch)await p.touchscreen.tap(off.x+x,off.y+y);else await p.mouse.click(off.x+x,off.y+y)};
 const clickSel=async sel=>{const r=await fr.evaluate(sel=>{const e=typeof sel==='string'?document.querySelector(sel):null;if(!e||!e.offsetParent)return null;e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}},sel);if(r){await tap(r.x,r.y);return true}return false};
 const enabled=()=>fr.evaluate(()=>!document.getElementById('next').disabled);
 let guard=0;
 while(guard++<15){
  const st=await fr.evaluate(()=>{const n=document.getElementById('next');return{line:(document.getElementById('line')||{}).textContent||'',dis:n.disabled,nvis:n.style.display!=='none'}});
  if(!st.nvis){res.push(`${id} 最後のステップ到達`);break}
  if(st.dis){let how='';
   // 1) ヒントボタン → .hint/.extra を実クリック
   for(let r=0;r<4&&!(await enabled());r++){
    if(await fr.$('#hint'))await clickSel('#hint');await sl(200);
    const hs=await fr.evaluate(()=>{const o=[];document.querySelectorAll('.extra,.hint').forEach((e,k)=>{if(!e.offsetParent||e.id==='hint')return;e.dataset.hz=k;o.push(k)});return o});
    for(const k of hs){await clickSel('[data-hz="'+k+'"]');await sl(250)}
    if(hs.length)how='ヒント';
    {const ps=await fr.$('#play')?'#play':'[data-k=play]';if(await fr.$(ps)){await clickSel(ps);await sl(400)}}
    for(let w=0;w<8&&!(await enabled());w++)await sl(500);
    if(!hs.length)break;
   }
   // 2) 実クリックの探索（マス・パレット・枠・ボタン）
   let n=0;
   while(!(await enabled())&&n<120){n++;
    const c=await fr.evaluate(()=>{const a=[...document.querySelectorAll('.cell,.key,.pad,.slot,.pal button,#pal button,.chip,[data-v],.bt,button')].filter(e=>e.offsetParent&&!e.disabled&&!['next','again','go','hint','clear','rand','play'].includes(e.id)&&!e.closest('#go')&&getComputedStyle(e).visibility!=='hidden');if(!a.length)return null;const e=a[Math.floor(Math.random()*a.length)];e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}});
    if(c)await tap(c.x,c.y);await sl(150);{const q=await fr.evaluate(()=>{const pa=[...document.querySelectorAll('#pal > *')].filter(e=>e.offsetParent),sl=[...document.querySelectorAll('#slots > *')].filter(e=>e.offsetParent);if(!pa.length||!sl.length)return null;const a=pa[Math.floor(Math.random()*pa.length)],b=sl[Math.floor(Math.random()*sl.length)];const r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect();return[r1.left+r1.width/2,r1.top+r1.height/2,r2.left+r2.width/2,r2.top+r2.height/2]});if(q){await tap(q[0],q[1]);await sl(120);await tap(q[2],q[3]);await sl(150)}}
    if(n%4===0){const ps=await fr.$('#play')?'#play':'[data-k=play]';if(await fr.$(ps)){await clickSel(ps);for(let w=0;w<20&&!(await enabled());w++)await sl(400);const pl=await fr.evaluate(ps=>/止/.test((document.querySelector(ps)||{}).textContent||''),ps);if(pl)await clickSel(ps)}}
   }
   if(await enabled())res.push(`${id}#${guard} OK(${how||'探索'+n}) ${st.line.slice(0,30)}`);
   else {res.push(`${id}#${guard} 進めず: ${(await fr.evaluate(()=>document.getElementById('line').textContent)).slice(0,80)}`);await fr.evaluate(()=>{document.getElementById('next').disabled=false})}
  }
  await fr.evaluate(()=>document.getElementById('next').click());await sl(600);
 }
 const fe2=await fr.evaluate(()=>window.__errs||[]);if(fe2.length)res.push(`${id} lesson errors: ${fe2.join(';')}`);
 console.log(res.join('\n'));
}
console.log('errors',errs);await b.close()})();
