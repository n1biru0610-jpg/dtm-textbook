// 4-7「王道進行を使ってみよう」を実クリック（タッチ）で最後まで進める。node l47.js [幅] [高さ] [t] [出力フォルダ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t',OUT=process.argv[5]||'.';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
let ok=true;const log=(...a)=>console.log(...a),ng=m=>{ok=false;log('NG',m)};
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const info=await p.evaluate(()=>({i:L.findIndex(l=>l.id==='4-7'),ch4:CH[3].ids.join(','),goal:GOAL['4-7'],qz:!!QZ['4-7'],n:L.length}));log(JSON.stringify(info));
if(info.i!==26)ng('4-7 の位置');
await p.evaluate(i=>startLesson(i),info.i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1000);const fe=await p.$('#f');const fr=await fe.contentFrame();const off=await fe.boundingBox();
if(!await fr.evaluate(()=>!!window.__l47))ng('4-7 が開いていない');
const click=async sel=>{const r=await fr.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const top=document.elementFromPoint(x,y);return {x,y,hit:!!top&&(top===e||e.contains(top)),w:b.width,h:b.height}},sel);
  if(!r){ng('ない '+sel);return}if(!r.hit)ng('隠れている '+sel);if(r.w<24||r.h<24)log('小さい',sel,r.w,r.h);
  if(touch)await p.touchscreen.tap(off.x+r.x,off.y+r.y);else await p.mouse.click(off.x+r.x,off.y+r.y);await p.waitForTimeout(250)};
const st=()=>fr.evaluate(()=>window.__sg.get());
const nextOn=()=>fr.evaluate(()=>!document.getElementById('next').disabled);
const waitNext=async()=>{for(let w=0;w<40&&!await nextOn();w++)await p.waitForTimeout(250);return nextOn()};
const goNext=async(n)=>{if(!await waitNext()){ng('つぎへが押せない step'+n+' '+await fr.evaluate(()=>document.getElementById('line').textContent));return false}await p.screenshot({path:OUT+'/l47_'+W+'_s'+n+'.png'});await click('#next');await p.waitForTimeout(400);return true};
const ln=()=>fr.evaluate(()=>document.getElementById('line').textContent);
// 0：Am と Em
if(await nextOn())ng('最初から つぎへ');
if((await fr.evaluate(()=>document.querySelectorAll('#pal .pi').length))!==5)ng('コードが5つない');
if((await fr.evaluate(()=>[...document.querySelectorAll('#pal .spot')].map(b=>b.dataset.i).join(',')))!=='3,4')ng('Am と Em だけ光る');
await click('#pal .pi:nth-child(5)');if(await nextOn())ng('Em だけで進める');await click('#pal .pi:nth-child(4)');
if(!await goNext(0))return fin();
// 1：F G Em Am（まちがいを入れてから直す）
if(!/王道進行/.test(await ln()))ng('ステップ1の説明');
const put=async(pi,sl)=>{await click('#pal .pi:nth-child('+pi+')');await click('#slots .sl:nth-child('+sl+')')};
await put(1,1);await put(3,2);await put(5,3);await put(4,4);
if(!/ちがう四角/.test(await ln()))ng('まちがいの案内');
await click('[data-k=play]');await p.waitForTimeout(11000);if(await nextOn())ng('まちがいでも進める');
await put(2,1);log('step1',JSON.stringify(await st()));await click('[data-k=play]');if(!await goNext(1))return fin();
// 2：A/B
if(!/せつなくて/.test(await ln()))ng('ステップ2の説明');
await click('#slots .sl:nth-child(1)');if(!/聴くだけ/.test(await fr.evaluate(()=>document.getElementById('hb').textContent)))ng('固定の案内');
const spot=()=>fr.evaluate(()=>[...document.querySelectorAll('#mbtns .spot')].map(b=>b.dataset.k).join(','));if(await spot()!=='A')ng('A が光っていない');
await click('[data-k=A]');await click('[data-k=B]');await p.waitForTimeout(500);if(await nextOn())ng('聴かずに進める');
await click('[data-k=A]');await p.waitForTimeout(10500);if(await spot()!=='B')ng('B が光っていない '+await spot());if(await nextOn())ng('A だけで進める');await click('[data-k=B]');
if(!await goNext(2))return fin();
const last=await fr.evaluate(()=>({go:getComputedStyle(document.getElementById('go')).display,lab:[...document.querySelectorAll('#slots .sl')].map(b=>b.getAttribute('aria-label'))}));log('last',JSON.stringify(last));
if(last.go==='none')ng('最後の画面でない');
await put(1,4);await click('[data-k=play]');
await p.waitForTimeout(800);const done=await p.evaluate(()=>isDone('4-7'));log('isDone',done);if(!done)ng('クリア記録');
await p.screenshot({path:OUT+'/l47_'+W+'_s3.png'});
await click('#again');const s0=await st();if(s0.cur!==0)ng('もう一回やる');
fin();
async function fin(){log('errors',errs);if(errs.length)ok=false;log(W,H,touch?'touch':'mouse',ok?'結果：すべてOK':'結果：NG あり');await b.close()}
})();
