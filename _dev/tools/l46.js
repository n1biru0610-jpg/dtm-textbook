// 4-6「コードのリズム」を実クリック（タッチ）で最後まで進める。node l46.js [幅] [高さ] [t] [出力フォルダ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+(process.argv[2]||1366),H=+(process.argv[3]||768),touch=process.argv[4]==='t',OUT=process.argv[5]||'.';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
let ok=true;const log=(...a)=>console.log(...a),ng=m=>{ok=false;log('NG',m)};
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const info=await p.evaluate(()=>({i:L.findIndex(l=>l.id==='4-6'),ch4:CH[3].ids.join(','),goal:GOAL['4-6'],qz:!!QZ['4-6'],n:L.length}));log(JSON.stringify(info));
if(info.i!==L45()+1)ng('4-6 の位置');function L45(){return 24}
await p.evaluate(i=>startLesson(i),info.i);await p.waitForTimeout(1200);
for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('#chap.on'));if(on){await p.mouse.click(W/2,H/2);await p.waitForTimeout(800)}else break}
await p.waitForTimeout(1000);const fe=await p.$('#f');const fr=await fe.contentFrame();const off=await fe.boundingBox();
if(!await fr.evaluate(()=>!!window.__l46))ng('4-6 が開いていない');
const click=async sel=>{const r=await fr.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const top=document.elementFromPoint(x,y);return {x,y,hit:!!top&&(top===e||e.contains(top)),w:b.width,h:b.height}},sel);
  if(!r){ng('ない '+sel);return}if(!r.hit)ng('隠れている '+sel);if(r.w<24||r.h<24)log('小さい',sel,r.w,r.h);
  if(touch)await p.touchscreen.tap(off.x+r.x,off.y+r.y);else await p.mouse.click(off.x+r.x,off.y+r.y);await p.waitForTimeout(250)};
const st=()=>fr.evaluate(()=>window.__sg.get());
const nextOn=()=>fr.evaluate(()=>!document.getElementById('next').disabled);
const waitNext=async()=>{for(let w=0;w<40&&!await nextOn();w++)await p.waitForTimeout(250);return nextOn()};
const goNext=async(n)=>{if(!await waitNext()){ng('つぎへが押せない step'+n+' '+await fr.evaluate(()=>document.getElementById('line').textContent));return false}await p.screenshot({path:OUT+'/l46_'+W+'_s'+n+'.png'});await click('#next');await p.waitForTimeout(400);return true};
// 0：おさらい
if(await nextOn())ng('最初から つぎへ が押せる');
await click('[data-k=play]');if(!await goNext(0))return fin();
// 1：3つのリズムを聴く
for(let k=0;k<3;k++){if(await nextOn())ng('全部聴く前に進める');await click('#pal .pi:nth-child('+(k+1)+')')}
if(!await goNext(1))return fin();
// 2：ぜんぶ4回（まちがえて「のばす」を入れてから直す）
await click('#pal .pi:nth-child(1)');await click('#slots .sl:nth-child(1)');
await click('#pal .pi:nth-child(3)');for(let k=1;k<=4;k++)await click('#slots .sl:nth-child('+k+')');
await click('[data-k=play]');log('step2',JSON.stringify(await st()));if(!await goNext(2))return fin();
// 3：さいごだけのばす。まちがい：さいごを2回
await click('#pal .pi:nth-child(2)');await click('#slots .sl:nth-child(4)');
const w=await fr.evaluate(()=>document.getElementById('line').textContent);if(!/4小節めだけ/.test(w))ng('まちがいの案内が出ない');
await click('[data-k=play]');await p.waitForTimeout(3000);if(await nextOn())ng('まちがいでも進める');
await click('#pal .pi:nth-child(1)');await click('#slots .sl:nth-child(4)');await click('[data-k=play]');if(!await goNext(3))return fin();
// 4：はずむ
if((await fr.evaluate(()=>document.querySelectorAll('#pal .pi').length))!==4)ng('はずむが出ていない');
await click('#pal .pi:nth-child(4)');await click('#slots .sl:nth-child(2)');await click('[data-k=play]');if(!await goNext(4))return fin();
// 5：さいご
const last=await fr.evaluate(()=>({go:getComputedStyle(document.getElementById('go')).display,lab:[...document.querySelectorAll('#slots .sl')].map(b=>b.getAttribute('aria-label'))}));log('last',JSON.stringify(last));
if(last.go==='none')ng('最後の画面でない');
await p.waitForTimeout(800);const done=await p.evaluate(()=>isDone('4-6'));log('isDone',done);if(!done)ng('クリア記録');
await p.screenshot({path:OUT+'/l46_'+W+'_s5.png'});
// もう一回やる
await click('#again');const s0=await st();if(s0.cur!==0)ng('もう一回やる');
fin();
async function fin(){log('errors',errs);if(errs.length)ok=false;log(W,H,touch?'touch':'mouse',ok?'結果：すべてOK':'結果：NG あり');await b.close()}
})();
