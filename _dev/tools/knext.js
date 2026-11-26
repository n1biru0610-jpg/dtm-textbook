// 基礎編：キーボードだけで「つぎへ」を押していったとき、ステップが変わってもフォーカスが消えないか／マウスでは枠が出ないか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const only=(process.argv[2]||'1-1').split(',');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push('top:'+e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);
await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const ids=await p.evaluate(()=>L.map(l=>l.id));
const A=()=>p.evaluate(()=>{let a=document.activeElement;let pre='';if(a&&a.tagName==='IFRAME'){a=a.contentDocument.activeElement;pre='[f]'}return pre+a.tagName+'#'+a.id+':'+(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,10)+(a.matches(':focus-visible')?' (枠あり)':'')});
for(const id of only){const li=ids.indexOf(id);
await p.evaluate(i=>startLesson(i),li);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(683,384);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1500);
const fr=await (await p.$('#f')).contentFrame();
console.log('==',id,'live=',await fr.evaluate(()=>document.getElementById('line').getAttribute('aria-live')));
// キーボード：つぎへ が有効な間は Tab でたどり着いて Enter
let lost=0;
for(let s=0;s<12;s++){
 const st=await fr.evaluate(()=>({dis:document.getElementById('next').disabled,hid:document.getElementById('next').style.display==='none'}));
 if(st.hid){console.log('  最後のステップ',await A());break}
 if(st.dis){await fr.evaluate(()=>{document.getElementById('next').disabled=false})}
 let found=false;for(let t=0;t<30;t++){const a=await A();if(a.startsWith('[f]BUTTON#next')){found=true;break}await p.keyboard.press('Tab')}
 if(!found){console.log('  つぎへに届かず');break}
 await p.keyboard.press('Enter');await p.waitForTimeout(400);const a=await A();console.log('  step',s,'→ Enter後 focus=',a);if(/BODY/.test(a))lost++;
}
console.log('  focus lost',lost);
}
// マウス：2-1 で つぎへ をクリック→枠が出ないこと
await p.evaluate(i=>startLesson(i),ids.indexOf('2-1'));await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(683,384);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1500);const fr=await (await p.$('#f')).contentFrame();
for(let s=0;s<6;s++){const n=await fr.$('#next');const ok=await fr.evaluate(()=>{const n=document.getElementById('next');n.disabled=false;return n.style.display!=='none'});if(!ok)break;await n.click({force:true});await p.waitForTimeout(400);console.log('mouse step',s,await A())}
await p.screenshot({path:'knext_mouse.png'});
console.log('errors',errs);await b.close()})();
