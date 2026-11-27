// 4-8「コードを完成させよう」を実クリック（タッチ）で最後まで進める。node l48.js [幅] [高さ] [t] [出力フォルダ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t',OUT=process.argv[5]||'.';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
let ok=true;const log=(...a)=>console.log(...a),ng=m=>{ok=false;log('NG',m)};
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const info=await p.evaluate(()=>({i:L.findIndex(l=>l.id==='4-8'),ch4:CH[3].ids.join(','),goal:GOAL['4-8'],qz:!!QZ['4-8'],newl:NEWL.join(','),n:L.length}));log(JSON.stringify(info));
if(info.i!==27)ng('4-8 の位置');
await p.evaluate(i=>startLesson(i),info.i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1000);const fe=await p.$('#f');const fr=await fe.contentFrame();const off=await fe.boundingBox();
if(!await fr.evaluate(()=>!!window.__l48))ng('4-8 が開いていない');
const click=async sel=>{const r=await fr.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const top=document.elementFromPoint(x,y);return {x,y,hit:!!top&&(top===e||e.contains(top)),w:b.width,h:b.height}},sel);
  if(!r){ng('ない '+sel);return}if(!r.hit)ng('隠れている '+sel);if(r.w<24||r.h<24)log('小さい',sel,r.w,r.h);
  if(touch)await p.touchscreen.tap(off.x+r.x,off.y+r.y);else await p.mouse.click(off.x+r.x,off.y+r.y);await p.waitForTimeout(250)};
const st=()=>fr.evaluate(()=>window.__sg.get());
const nextOn=()=>fr.evaluate(()=>!document.getElementById('next').disabled);
const waitNext=async()=>{for(let w=0;w<40&&!await nextOn();w++)await p.waitForTimeout(250);return nextOn()};
const goNext=async(n)=>{if(!await waitNext()){ng('つぎへが押せない step'+n+' '+await fr.evaluate(()=>document.getElementById('line').textContent));return false}await p.screenshot({path:OUT+'/l48_'+W+'_s'+n+'.png'});await click('#next');await p.waitForTimeout(400);return true};
const ln=()=>fr.evaluate(()=>document.getElementById('line').textContent);
// 0：メロディを聴く
if(await nextOn())ng('最初から つぎへ');
if(!/まとめ/.test(await ln()))ng('ステップ0の説明');
await click('#slots .sl:nth-child(2)');if(!/聴くだけ/.test(await fr.evaluate(()=>document.getElementById('hb').textContent)))ng('固定の案内');
await click('[data-k=play]');await p.waitForTimeout(10500);
if(!await goNext(0))return fin();
// 1：コードをつける（まちがいを入れてから直す）
const put=async(pi,sl)=>{await click('#pal .pi:nth-child('+pi+')');await click('#slots .sl:nth-child('+sl+')')};
if((await fr.evaluate(()=>document.querySelectorAll('#pal .pi').length))!==5)ng('コードが5つない');
await put(2,1);if(!(await fr.evaluate(()=>document.querySelector('#slots .sl:nth-child(1)').classList.contains('bad'))))ng('×が出ない');
await put(1,1);await put(4,2);await put(2,3);await put(2,4);
if(!/×の四角/.test(await ln()))ng('まちがいの案内');
await click('[data-k=play]');await p.waitForTimeout(10500);if(await nextOn())ng('まちがいでも進める');
await put(1,4);if(!/4-5 のおさらい/.test(await ln()))ng('直したら説明にもどる');
log('step1',JSON.stringify(await st()));await click('[data-k=play]');if(!await goNext(1))return fin();
// 2：リズム
if(!/リズム/.test(await ln()))ng('ステップ2の説明');
const labs=()=>fr.evaluate(()=>[...document.querySelectorAll('#slots .sl b')].map(b=>b.textContent).join(','));
if(await labs()!=='C,Am,F,C')ng('コード名 '+await labs());
await put(3,1);await put(3,2);await click('[data-k=play]');await p.waitForTimeout(10500);if(await nextOn())ng('空きがあっても進める');
if(!/リズム？/.test(await ln()))ng('空きの案内');
await put(4,3);await put(1,4);await click('[data-k=play]');if(!await goNext(2))return fin();
// 3：メロディだけ／伴奏つき
const spot=()=>fr.evaluate(()=>[...document.querySelectorAll('#mbtns .spot')].map(b=>b.dataset.k).join(','));if(await spot()!=='mo')ng('メロディだけ が光っていない '+await spot());
const subs=()=>fr.evaluate(()=>[...document.querySelectorAll('#slots .sl small')].map(b=>b.textContent).join(','));
if(await subs()!=='4回,4回,はずむ,のばす')ng('リズムが残っていない '+await subs());
await click('[data-k=mo]');await click('[data-k=ba]');await p.waitForTimeout(500);if(await nextOn())ng('聴かずに進める');
await click('[data-k=mo]');await p.waitForTimeout(10500);if(await spot()!=='ba')ng('伴奏つき が光っていない '+await spot());if(await nextOn())ng('メロディだけで進める');await click('[data-k=ba]');
if(!await goNext(3))return fin();
const last=await fr.evaluate(()=>({go:getComputedStyle(document.getElementById('go')).display,lab:[...document.querySelectorAll('#slots .sl')].map(b=>b.getAttribute('aria-label'))}));log('last',JSON.stringify(last));
if(last.go==='none')ng('最後の画面でない');
await put(3,4);await click('[data-k=play]');
await p.waitForTimeout(800);const done=await p.evaluate(()=>isDone('4-8'));log('isDone',done);if(!done)ng('クリア記録');
await p.screenshot({path:OUT+'/l48_'+W+'_s4.png'});
await click('#again');const s0=await st();if(s0.cur!==0)ng('もう一回やる');
fin();
async function fin(){log('errors',errs);if(errs.length)ok=false;log(W,H,touch?'touch':'mouse',ok?'結果：すべてOK':'結果：NG あり');await b.close()}
})();
